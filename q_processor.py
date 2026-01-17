#!/usr/bin/env python3
"""
Single-threaded MCQ enrichment pipeline using Gemini.
Features:
- Strict Pydantic validation
- Atomic writes
- Crash-safe
- No retries
- No multithreading
- On FIRST failure → save remaining items and exit
"""

import hashlib
import json
import logging
import os
import re
import shutil
import time
from typing import Any, Dict, List, Optional, Tuple

import google.generativeai as genai
from pydantic import BaseModel, Field, ValidationError, field_validator

# ====================================================
# CONFIG
# ====================================================
API_KEY = "AIzaSyCsxOFaH-g3BjAtmMckpuXJLNdY3Gct_d4"
INPUT_FILE = "unprocessed_questions_file.json"
OUTPUT_FILE = "output.json"
REMAINING_FILE = "remaining_file.json"

BATCH_SIZE = 5
MODEL_NAME = "gemini-flash-latest"

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger("mcq_pipeline")


# ====================================================
# STRICT Pydantic Models
# ====================================================
class Option(BaseModel):
    option: str = Field(..., description="Option label such as 'A', 'B', etc.")
    text: str = Field(..., description="Full text of the option")
    is_correct: bool = Field(..., description="True only for the single correct option")

    @field_validator("option")
    def option_upper(cls, v: str):
        if not isinstance(v, str) or len(v.strip()) == 0:
            raise ValueError("option must be a non-empty string")
        return v.strip()


class ProcessedQuestion(BaseModel):
    question: str = Field(..., description="Cleaned question stem")
    options: List[Option] = Field(
        ..., min_length=2, description="List of answer options"
    )

    specialty: List[str] = Field(
        ...,
        max_length=3,
        description="1–3 specialties based on the classification rules",
    )

    related_topics: List[str] = Field(
        ..., description="1–10 medically correct related curriculum topics"
    )

    related_terms: List[str] = Field(..., description="5–10 medically relevant terms")

    explanation: str = Field(..., description="Markdown formatted explanation")
    answer: str = Field(..., description="Exact text of the correct option")
    hint: str = Field(
        ..., description="One or two sentence hint that does not reveal the answer"
    )
    needs_review: bool = Field(
        ..., description="Flag for mismatch between answer and explanation"
    )

    summary: str = Field(
        ...,
        description="High-yield monograph or structured outline depending on the question type",
    )

    question_category: str = Field(
        ..., description="Diagnosis / Investigation / Management / Pharmacology / etc."
    )

    difficulty: str = Field(
        ...,
        description="Difficulty formatted strictly as 'N (Label)' e.g. '3 (Application)'",
    )

    clinical_setting: str = Field(
        ..., description="Setting such as GP Practice, ED, Ward, or Other"
    )

    key_takeaway: str = Field(
        ..., description="<= 20 words summarising the core principle"
    )

    common_pitfall: Optional[str] = Field(
        None, description="Common mistake students make in this scenario"
    )

    guideline_ref: Optional[str] = Field(
        None, description="Specific guideline reference (e.g. NICE NG143) or null"
    )

    @field_validator("options")
    def one_correct(cls, v: List[Option]):
        correct_count = sum(o.is_correct for o in v)
        if correct_count != 1:
            raise ValueError("Exactly one option must have is_correct == true")
        return v

    @field_validator("difficulty")
    def difficulty_format(cls, v: str):
        if not isinstance(v, str):
            raise ValueError("difficulty must be a string like '1 (Recall)'")
        if not re.match(r"^[1-5]\s*\(.*\)$", v.strip()):
            raise ValueError("difficulty must match 'N (Label)' with N in 1..5")
        return v.strip()

    @field_validator("key_takeaway")
    def takeaway_length(cls, v: str):
        if len(v.strip().split()) > 20:
            raise ValueError("key_takeaway must be <= 20 words")
        return v.strip()


# ============================
# Prompt (SYSTEM_PROMPT)
# ============================
# Replace the large prompt text as required by your pipeline. Provide same SYSTEM_PROMPT variable.

STANDARD_PLAB_SPECIALTIES = [
    "endocrinology",
    "child and adolescent psychiatry",
    "neurology",
    "cardiothoracic surgery",
    "aerospace medicine",
    "clinical neurophysiology",
    "gastroenterology",
    "infectious diseases",
    "medical oncology",
    "dermatology",
    "obstetrics and gynaecology",
    "neuropathology",
    "allergy",
    "critical care medicine",
    "geriatric medicine",
    "neurosurgery",
    "cardiology",
    "emergency medicine",
    "internal medicine",
    "pharmacology",
    "clinical genetics",
    "otorhinolaryngology (ENT)",
    "hospice and palliative medicine",
    "paediatrics",
    "general practice",
    "anaesthetics",
    "clinical oncology",
    "clinical radiology",
    "community sexual and reproductive health",
    "diagnostic neuropathology",
    "forensic histopathology",
    "general surgery",
    "haematology",
    "histopathology",
    "immunology",
    "medical microbiology",
    "medical ophthalmology",
    "medical psychotherapy",
    "occupational medicine",
    "old age psychiatry",
    "ophthalmology",
    "oral and maxillo-facial surgery",
    "paediatric cardiology",
    "paediatric surgery",
    "plastic surgery",
    "psychiatry of learning disability",
    "public health medicine",
    "rehabilitation medicine",
    "renal medicine",
    "respiratory medicine",
    "rheumatology",
    "sport and exercise medicine",
    "trauma and orthopaedic surgery",
    "tropical medicine",
    "urology",
    "vascular surgery",
    "anatomy",
    "ethics",
]

specialty_list_str = ",\n".join([f'- "{s}"' for s in STANDARD_PLAB_SPECIALTIES])

SYSTEM_PROMPT = f"""
You are an expert PLAB / UK medical educator and data engineer.
Your task is to transform raw MCQ data into a strict, validated JSON structure enriched with high-value pedagogical metadata.

====================================================
SPECIALTY CLASSIFICATION RULES (MANDATORY)
====================================================
Choose a max of 3 specialties ONLY from the following list:
{specialty_list_str}

**Logic:**
1. GENERALIST GROUP (Broad/Foundation): general practice, internal medicine, emergency medicine, paediatrics, obs & gynae, psychiatry, general surgery.
2. SPECIALIST GROUP (Specific): All others.
3. If unclear -> return empty list [].

====================================================
TRANSFORMATION REQUIREMENTS
====================================================

1. **ANSWER & CLEANING**:
   - Identify the SINGLE correct option. If 'answer' field is empty, deduce it from the explanation.
   - Set `is_correct: true` for the winner.
   - Copy the EXACT text of the correct option to the `answer` field.
   - Fix grammar/spelling and remove chat artefacts in stem/options/explanation. DO NOT change clinical meaning.

2. **EXPLANATION (Markdown)**:
   - Use bold headings: **## Diagnosis** and **## Distractors**. Also use bullet points and newlines where necessary to improve readability
   - Justify the correct answer and explain why EACH distractor is wrong.
   - Source authority: NICE CKS / GMC Guidelines else null.

3. **SUMMARY (Monograph)**:
   - Create a Markdown structured note with bullet points and newlines where necessary to improve readability.
   - For Clinical: Definition, Aetiology/Risk Factors, Pathophysiology, Clinical Clinchers, Findings on general and system-specific examination, (if applicable), Investigations (first-line and gold-standard (if applicable)), Management (Step-wise).
   - For Non-Clinical, generate an authoritative structured outline relevant to the topic, including:
     • Definition/Concept  
     • Key Principles/Mechanisms  
     • Important Examples/Applications  
     • Key Considerations for Exams or Practice
     * Any other relevant subtopic

4. **TAGGING**:
   - **related_topics**: 1–10 medically correct curriculum topics and searchable keywords.
   - **related_terms**: 5–10 key medical terms/anatomy/diagnoses.
   - **hint**: 1–2 sentences, Socratic style (do not give the answer away).
   - **needs_review**: True if the value of the answer key is correct,   the correct answer can be gotten from the explanation and is correct. False, if the value of the answer key is false and the correct answer cannot be gotten from the explanation 

5. **METADATA TAGGING**:
   - `question_category`: Diagnosis, Investigation, Management, Pharmacology, Anatomy, Ethics, or domain-specific.
   - `difficulty`: 1 (Recall) to 5 (Complex Reasoning). value should be the number along with the string value, strictly in that format and with this grading system,: ' 1 (Recall), 2 (Understanding), 3 (Application), 4 (Analysis), 5 (Complex Reasoning)' 
   - `clinical_setting`: GP Practice, ED, Ward, Follow-up/Clinic, etc.
   - `key_takeaway`: Max 20 words. High-yield pearl.
   - `common_pitfall`: A specific warning about the most common error or 'trap' students fall into for this specific clinical scenario.
   - `guideline_ref`: The specific guideline code and title used as the source of truth (e.g., 'NICE NG143', 'BTS Guidelines 2024') and reference number in bracket, null if not sure or cannot find.

====================================================
STRICT OUTPUT SCHEMA
====================================================
Return ONLY a JSON List. No markdown formatting. No preamble.

[
  {{
    "question": "String",
    "options": [
      {{ "option": "A", "text": "String", "is_correct": Boolean }}
    ],
    "specialty": ["String"],
    "related_topics": ["String"],
    "related_terms": ["String"],
    "explanation": "Markdown String",
    "answer": "String",
    "hint": "String",
    "needs_review": Boolean,
    "summary": "Markdown String",
    "question_category": "String",
    "difficulty": "String",
    "clinical_setting": "String",
    "key_takeaway": "String",
    "common_pitfall": "String",
    "guideline_ref": "String"
  }}
]
"""


# ====================================================
# Utilities
# ====================================================
def configure_genai():
    genai.configure(api_key=API_KEY)


def atomic_write(data: List[Dict], filename: str):
    temp = f"{filename}.tmp"
    with open(temp, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    shutil.move(temp, filename)


def json_extract(raw: str) -> Tuple[Optional[str], Optional[str]]:
    """Extract the first JSON object or array from model output."""
    if not raw:
        return None, "Empty model response"

    cleaned = re.sub(r"^```(?:json)?\s*", "", raw.strip(), flags=re.IGNORECASE)
    cleaned = re.sub(r"\s*```$", "", cleaned, flags=re.IGNORECASE).strip()

    try:
        json.loads(cleaned)
        return cleaned, None
    except Exception as e:
        return None, f"JSON parse error: {e}"


def hash_question(q: str) -> str:
    payload = q
    return hashlib.sha256(payload.encode()).hexdigest()


# ====================================================
# MODEL CALL
# ====================================================
def process_batch(model, batch: List[Dict]):
    """Send one batch to Gemini. No retries."""
    payload = f"TRANSFORM THIS DATA:\n{json.dumps(batch, ensure_ascii=False)}"
    try:
        response = model.generate_content(
            contents=[payload],
            generation_config=genai.types.GenerationConfig(
                temperature=0.1,
                response_mime_type="application/json",
            ),
        )

        raw_text = getattr(response, "text", str(response))
        json_text, err = json_extract(raw_text)

        if err:
            return None, err

        parsed = json.loads(json_text)
        if isinstance(parsed, dict):
            parsed = [parsed]
        if not isinstance(parsed, list):
            return None, "Model output was not a list"

        return parsed, None

    except Exception as e:
        return None, str(e)


# ====================================================
# MAIN PIPELINE
# ====================================================
def main():
    logger.info("Starting single-threaded enrichment pipeline")
    configure_genai()
    model = genai.GenerativeModel(
        model_name=MODEL_NAME, system_instruction=SYSTEM_PROMPT
    )

    # ====================================================
    # Load previously remaining items (if any)
    # ====================================================
    if os.path.exists(REMAINING_FILE):
        logger.info("Loading from existing remaining_file.json")
        with open(REMAINING_FILE, "r") as f:
            to_process = json.load(f)
    else:
        with open(INPUT_FILE, "r") as f:
            raw = json.load(f)

        # Deduplication
        seen = set()
        to_process = []
        for q in raw:
            h = hash_question(q["question"])
            if h not in seen:
                to_process.append(q)
                seen.add(h)

        logger.info(f"Loaded {len(to_process)} unique questions from input")

    with open(REMAINING_FILE, "w") as f:
        json.dump(to_process, f, indent=2, ensure_ascii=False)

    # ====================================================
    # Load existing processed (if the script is resumed manually)
    # ====================================================
    processed = []
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, "r") as f:
            processed = json.load(f)
        logger.info(f"Loaded {len(processed)} previously processed items")

    # ====================================================
    # Process sequentially, batch by batch
    # ====================================================
    total = len(to_process)
    idx = 0
    # if os.path.exists('last_index'):
    #     with open('last_index', 'r') as f:
    #         idx = json.load(f)

    try:    
        while idx < total:
            batch = to_process[idx : idx + BATCH_SIZE]
            logger.info(f"Processing batch {idx // BATCH_SIZE + 1}")

            parsed, error = process_batch(model, batch)

            if error or parsed is None:
                logger.error(f"Batch failed: {error}")
                logger.error("Saving remaining items and exiting...")

                # Save remaining including failed batch
                atomic_write(to_process[idx:], REMAINING_FILE)
                atomic_write(processed, OUTPUT_FILE)
                return

            processed.extend(parsed)

            # Save continuously
            atomic_write(processed, OUTPUT_FILE)

            idx += BATCH_SIZE
            print(
                f"Batch {(idx // BATCH_SIZE) + 1} of {(len(to_process) // BATCH_SIZE) + 1}"
            )
            # with open("last_index_1", "w") as f:
            #     json.dump(idx, f)
        # time.sleep(2)
    except Exception as e:    
        print(e)

    print('done')    


if __name__ == "__main__":
    main()
