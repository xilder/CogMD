import asyncio
import json
import os
from re import A

from dotenv import load_dotenv
from postgrest.exceptions import APIError
from supabase import AsyncClient, acreate_client

load_dotenv()

# --- 1. Supabase Client Setup ---
url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "")


def load_questions_from_file(file_path: str) -> list:
    """Loads the large list of questions from a JSON file."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            questions = json.load(f)
            print(f"Loaded {len(questions)} questions from {file_path}")
            return questions
    except FileNotFoundError:
        print(f"ERROR: Question file not found at {file_path}")
        return []
    except json.JSONDecodeError:
        print(f"ERROR: Could not decode JSON from {file_path}")
        return []


async def _upsert_and_get_map(questions: list, supabase: AsyncClient) -> dict:
    """
    Helper function to bulk-upsert many-to-many items (specialties/terms)
    and return a mapping of their name to their ID.
    """
    "dami".strip()
    specialties = set()
    r_terms = set()
    topics = set()

    for question in questions:
        specialties = specialties.union(set(question["specialty"]))
        r_terms = r_terms.union(set(question["related_terms"]))
        topics = topics.union(set(question["related_topics"]))

    print(
        f"Upserting tags:\nTotal: {len(specialties) + len(r_terms) + len(topics)}. ({len(specialties)} specialties, {len(r_terms)} related terms, {len(topics)} topics)..."
    )
    try:
        # 1. Upsert all unique items in one go
        s_data = [{"name": name.strip(), "type": "SPECIALTY"} for name in specialties]
        r_data = [{"name": name.strip(), "type": "RELATED_TERM"} for name in r_terms]
        t_data = [{"name": name.strip(), "type": "TOPIC"} for name in r_terms]

        r_response = (
            await supabase.table("tags").upsert(r_data, on_conflict="name").execute()
        )
        t_response = (
            await supabase.table("tags").upsert(t_data, on_conflict="name").execute()
        )
        s_response = (
            await supabase.table("tags").upsert(s_data, on_conflict="name").execute()
        )

        if not r_response.data:
            raise Exception("No data returned from upsert. related_term")
        if not t_response.data:
            raise Exception("No data returned from upsert. topic")
        if not s_response.data:
            raise Exception("No data returned from upsert. specialty")

        response = await supabase.table("tags").select("*").execute()

        if not response.data:
            raise Exception("No data returned from upsert.")

        # 2. Create the name -> id map
        # This is a simple in-memory "dictionary" for fast lookups
        name_to_id_map = {item["name"]: item["id"] for item in response.data}
        print(f"Successfully mapped {len(name_to_id_map)} items.")
        with open("all_tags.json", "w") as f:
            json.dump(name_to_id_map, f)
        return name_to_id_map

    except APIError as e:
        print(f"API Error upserting: {e.message}")
        return {}
    except Exception as e:
        print(f"Error creating map: {e}")
        return {}


async def batch_upload_questions(all_questions: list, supabase: AsyncClient):
    """
    Uploads all questions in batches for maximum efficiency.
    """

    print("Pre-processing: Finding all unique specialties and terms...")

    all_tags_map = await _upsert_and_get_map(all_questions, supabase)

    print("\n--- Starting Batch Upload Process ---")
    successful, failed = 0, 0
    failed_questions = []
    for i in range(0, len(all_questions)):
        try:
            q_data = all_questions[i].copy()
            q_tags = []
            options_to_insert = []
            guideline_ref = (
                None
                if q_data["guideline_ref"] is None or q_data["guideline_ref"] == "null"
                else q_data["guideline_ref"]
            )
            question_to_insert = {
                "question_text": q_data["question"].strip(),
                "explanation": q_data["explanation"].strip(),
                "status": "published" if not q_data["needs_review"] else "draft",
                "created_by_user_id": "cb8fa0d1-d119-4109-9a04-8d85fd6b22ff",
                "hint": q_data["hint"].strip(),
                "question_category": q_data["question_category"].strip(),
                "clinical_setting": q_data["clinical_setting"].strip(),
                "summary": q_data["summary"].strip(),
                "common_pitfall": q_data["common_pitfall"].strip(),
                "guideline_ref": guideline_ref,
                "ranked_difficulty": q_data["difficulty"].strip().split(" ")[0],
                "key_takeaway": q_data["key_takeaway"].strip(),
            }
            q_res = (
                await supabase.table("questions").insert(question_to_insert).execute()
            )
            if not q_res.data:
                failed += 1
                print(f"Failed to insert question {i+1}. Skipping...")
                print(f"Failed questions so far: {failed}")
                continue
            created_question = q_res.data[0]
            new_question_id = created_question["id"]
            for opt in q_data.get("options", []):
                options_to_insert.append(
                    {
                        "question_id": new_question_id,
                        # "option": opt["option"],
                        "option_text": opt["text"].strip(),
                        "is_correct": opt["is_correct"],
                    }
                )
            await supabase.table("options").insert(options_to_insert).execute()
            _tags = list(
                set(
                    q_data.get("specialty", [])
                    + q_data.get("related_terms", [])
                    + q_data.get("related_topics", [])
                )
            )
            tags = [tag.strip() for tag in _tags]
            q_tags.extend(tags)
            q_tags_links = [
                {"question_id": new_question_id, "tag_id": all_tags_map.get(tag_name)}
                for tag_name in q_tags
                if all_tags_map.get(tag_name)
            ]

            await supabase.table("question_tags").insert(q_tags_links).execute()
            successful += 1
            print(
                f"Successfully inserted question {i+1}. Total successful: {successful}"
            )
        except APIError as e:
            print(f"ERROR processing question {i}: {e.message}")
            print("Skipping this question and continuing...")
            failed_questions.append((q_data))
            continue
        except Exception as e:
            print(f"CRITICAL ERROR processing quesetion {i}: {e}")
            print("Skipping this chunk and continuing...")

    with open('failed.json', 'w') as f:
        json.dump(failed_questions, f)
    print("\n--- Batch Upload Complete ---")


async def main():
    # Load your giant JSON file
    # Make sure this file is a JSON *list* of your question objects
    supabase: AsyncClient = await acreate_client(url, key)
    all_questions = load_questions_from_file("output_file.json")

    if all_questions:
        await batch_upload_questions(all_questions, supabase)


if __name__ == "__main__":
    if not url or not key:
        print("FATAL: SUPABASE_URL and SUPABASE_KEY environment variables are not set.")
    else:
        asyncio.run(main())
