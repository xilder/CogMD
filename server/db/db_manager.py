import asyncio
import os
import json
from supabase import create_client, Client, ClientOptions
from postgrest.exceptions import APIError

# Initialize the Supabase client
# Make sure to set these as environment variables in your project
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

# The create_client function creates a unified client.
# We will use its async methods by using 'await'.


async def upload_full_question(question_data: dict, supabase: Client):
    """
    Uploads a question, its options, specialties, and related terms
    in a more transactional way. If any step fails, it attempts to
    delete the created question to prevent orphaned data.
    """
    question_id = None  # Initialize question_id to None
    
    try:
        # --- 1. Insert the main question and get its ID ---
        question_res = await supabase.table("questions").insert({
            "question_text": question_data["question"],
            "explanation": question_data["explanation"],
            "answer": question_data["answer"]
        }).execute()

        if not question_res.data or len(question_res.data) == 0:
            raise Exception("Failed to insert question, no data returned.")

        question_id = question_res.data[0]['id']
        print(f"Successfully inserted question with ID: {question_id}")

        # --- 2. Insert all options linked to the question ID ---
        options_to_insert = [
            {
                "question_id": question_id,
                "option_char": opt["option"],
                "option_text": opt["text"]
            }
            for opt in question_data["options"]
        ]
        if options_to_insert:
            await supabase.table("options").insert(options_to_insert).execute()
            print("Successfully inserted options.")

        # --- 3. Handle Specialties (Upsert and Link) ---
        specialties = question_data.get("specialty", [])
        if specialties:
            specialty_res = await supabase.table("specialties").upsert(
                [{"name": s} for s in specialties],
                on_conflict="name"  # Ensure this matches your unique constraint
            ).execute()
            specialty_ids = [s['id'] for s in specialty_res.data]
            
            await supabase.table("question_specialties").insert(
                [{"question_id": question_id, "specialty_id": sid} for sid in specialty_ids]
            ).execute()
            print("Successfully linked specialties.")

        # --- 4. Handle Related Terms (Upsert and Link) ---
        terms = question_data.get("related_terms", [])
        if terms:
            term_res = await supabase.table("related_terms").upsert(
                [{"term": t} for t in terms],
                on_conflict="term" # Ensure this matches your unique constraint
            ).execute()
            term_ids = [t['id'] for t in term_res.data]
            
            await supabase.table("question_related_terms").insert(
                [{"question_id": question_id, "term_id": tid} for tid in term_ids]
            ).execute()
            print("Successfully linked related terms.")

        return {"status": "success", "question_id": question_id}

    except APIError as e:
        print(f"An API error occurred: {e.message}")
        if question_id:
            print(f"Attempting to roll back... deleting question {question_id}")
            await supabase.table("questions").delete().eq("id", question_id).execute()
            print("Rollback successful.")
        return {"status": "error", "message": e.message}
    except Exception as e:
        print(f"A general error occurred: {e}")
        if question_id:
            print(f"Attempting to roll back... deleting question {question_id}")
            # Because the parent question is set to 'ON DELETE CASCADE',
            # Supabase will automatically delete all related options,
            # question_specialties, and question_related_terms.
            await supabase.table("questions").delete().eq("id", question_id).execute()
            print("Rollback successful.")
        return {"status": "error", "message": str(e)}


async def get_question_with_details(question_id: str, supabase: Client):
    """
    Retrieves a single question along with its options, specialties, and terms.
    """
    try:
        # The 'select' statement automatically joins tables based on 
        # the foreign key relationships you defined in the SQL setup.
        response = await supabase.from_("questions").select(
            """
            id,
            question_text,
            explanation,
            answer,
            options ( option_char, option_text ),
            specialties ( name ),
            related_terms ( term )
            """
        ).eq("id", question_id).single().execute()

        return response.data
    except APIError as e:
        print(f"Error fetching question: {e.message}")
        return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None


async def get_questions_by_specialty(specialty_name: str, supabase: Client):
    """
    Retrieves all questions (and their options) linked to a specific specialty.
    """
    try:
        # This query finds a specialty by name, then joins through
        # the 'question_specialties' table to get all matching questions.
        response = await supabase.from_("specialties").select(
            """
            name,
            questions ( *, options(*) )
            """
        ).eq("name", specialty_name).single().execute()
        
        # The result is nested, so we return the list of questions
        return response.data.get("questions", []) if response.data else []
    except APIError as e:
        print(f"Error fetching by specialty: {e.message}")
        return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

async def get_questions_by_term(related_term: str, supabase: Client):
    """
    Retrieves all questions (and their options) linked to a specific related term.
    """
    try:
        # This query works just like the specialty one
        response = await supabase.from_("related_terms").select(
            """
            term,
            questions ( *, options(*) )
            """
        ).eq("term", related_term).single().execute()
        
        return response.data.get("questions", []) if response.data else []
    except APIError as e:
        print(f"Error fetching by term: {e.message}")
        return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return []


async def main():
    """Main function to demonstrate the usage."""
    supabase: Client = await create_client(url, key)
    sample_question = {
        "question": "A 38 year old man was slapped over his right ear during a fight. There is blood coming from his right external auditory canal. He describes the pain as intense and he also has ringing in his ears. He is also noted to have decreased hearing on that ear. What is the SINGLE most appropriate initial investigation?",
        "options": [
            {"option": "A", "text": "Compute tomography"},
            {"option": "B", "text": "Magnetic resonance imaging"},
            {"option": "C", "text": "Otoscopy"},
            {"option": "D", "text": "Skull X-ray"},
            {"option": "E", "text": "Facial X-ray"}
        ],
        "specialty": ["Otolaryngology", "Emergency Medicine"],
        "explanation": "From the history and mechanism of injury, this patient likely has a perforated eardrum...",
        "answer": "Otoscopy",
        "related_terms": ["Tympanic membrane perforation", "Otoscopy", "Ear trauma"]
    }

    print("--- 1. Testing Question Upload ---")
    upload_result = await upload_full_question(sample_question,supabase)
    print(upload_result)
    
    if upload_result['status'] == 'success':
        new_question_id = upload_result['question_id']
        
        print("\n--- 2. Testing Retrieval of the Uploaded Question ---")
        question_details = await get_question_with_details(new_question_id, supabase)
        if question_details:
            print(json.dumps(question_details, indent=2))
        else:
            print("Could not retrieve question.")

        print("\n--- 3a. Testing Retrieval by Specialty: 'Otolaryngology' ---")
        specialty_questions = await get_questions_by_specialty("Otolaryngology", supabase)
        print(f"Found {len(specialty_questions)} question(s).")
        if specialty_questions:
            print(json.dumps(specialty_questions[0], indent=2)) # Just print first one

        print("\n--- 3b. Testing Retrieval by Related Term: 'Otoscopy' ---")
        term_questions = await get_questions_by_term("Otoscopy", supabase)
        print(f"Found {len(term_questions)} question(s).")
        if term_questions:
            print(json.dumps(term_questions[0], indent=2)) # Just print first one
            
    # --- Test Error Handling ---
    print("\n--- 4. Testing Error Handling (simulating bad data) ---")
    bad_question = {
        "question": "This question will fail.",
        "options": [
            # This is bad data: option_char should not be null,
            # but our table doesn't enforce it. Let's simulate
            # a different error: linking to a non-existent specialty ID.
            # A better way to force an error is to violate a rule.
            # Let's try to insert a question with a NULL question_text
        ],
        "question_text": None, # This should violate 'NOT NULL'
        "explanation": "This will fail.",
        "answer": "N/A"
    }
    # Note: To truly test the rollback, you'd need to simulate a failure
    # *after* question insertion, e.g., by providing malformed data
    # to the options insert. For this example, we'll just show a
    # primary insertion failure.
    
    # Let's try a different bad question that fails *after* insertion
    bad_question_2 = sample_question.copy()
    bad_question_2["question"] = "This question has bad options"
    # This will fail because 'question_id' isn't provided,
    # but my code *adds* question_id.
    # Let's force a failure by breaking the 'specialties' part.
    # We can't easily do that without complex mocking.
    
    # The current `try...except` block with the 'question_id' check
    # is the correct pattern to handle this.
    
    # Let's simulate a failure by giving bad data for options
    bad_question_3 = sample_question.copy()
    bad_question_3["question"] = "This question has bad option format"
    bad_question_3["options"] = [
        {"option": "A", "wrong_key": "This will fail"} # 'option_text' is missing
    ]
    # This will likely raise an APIError from Supabase
    upload_result_fail = await upload_full_question(bad_question_3, supabase)
    print(upload_result_fail)


if __name__ == "__main__":
    # Ensure you have .env file or environment variables set
    # from dotenv import load_dotenv
    # load_dotenv()
    
    asyncio.run(main())