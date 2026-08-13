import os
import re
from anthropic import Anthropic
from dotenv import load_dotenv
from pathlib import Path
from pypdf import PdfReader
from supabase import create_client, Client

load_dotenv('.env.local')

SUPABASE_URL = os.getenv("SUPABASE_URL_LOCAL")
SUPABASE_KEY = os.getenv("SUPABASE_SECRET_KEY_LOCAL")
QUESTION_BANK_DIR = Path("./scripts/question_bank")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def extract_text_from_pdf(pdf_path: Path) -> str:
    """Reads and extracts all plain text from a PDF file."""
    reader = PdfReader(pdf_path)
    extracted_pages = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            extracted_pages.append(text)
    return "\n\n".join(extracted_pages).strip()


def parse_metadata_from_folder(folder_path: Path) -> dict:
    """Extracts year and constructs a question_title from folder/file naming conventions."""
    folder_name = folder_path.name

    # Extract 4-digit year (e.g. 2024, 2025)
    year_match = re.search(r"\b(20\d{2})\b", folder_name)
    year = int(year_match.group(1)) if year_match else None

    # Derive question title from folder name (replacing underscores/hyphens with spaces)
    title = re.sub(r"[_\-]+", " ", folder_name).strip()

    return {"question_title": title, "year_of_question": year}


def process_question_bank():
    if not QUESTION_BANK_DIR.exists():
        print(f"Directory '{QUESTION_BANK_DIR}' does not exist.")
        return

    for folder in QUESTION_BANK_DIR.iterdir():
        if not folder.is_dir():
            continue

        print(f"Processing folder: {folder.name}")

        qp_file = None
        ans_file = None

        # Identify QP and ANS files in the folder
        for file in folder.glob("*.pdf"):
            fname = file.name.lower()
            if "qp" in fname:
                qp_file = file
            elif "ans":
                ans_file = file

        if not qp_file:
            print(f"  [Skipped] Could not locate QP file in '{folder.name}'")
            continue

        # Extract text content
        question_content = extract_text_from_pdf(qp_file)
        question_solution = extract_text_from_pdf(ans_file) if ans_file else None

        # Extract metadata
        meta = parse_metadata_from_folder(folder)

        client = Anthropic()

        response = client.messages.create(
            model="claude-haiku-4-5",
            messages=[
                {
                    "role": "user",
                    "content": "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm.",
                }
            ],
            output_config={
                "format": {
                    "type": "json_schema",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "email": {"type": "string"},
                            "plan_interest": {"type": "string"},
                            "demo_requested": {"type": "boolean"},
                        },
                        "required": ["name", "email", "plan_interest", "demo_requested"],
                        "additionalProperties": False,
                    },
                }
            },
        )
        print(next(block.text for block in response.content if block.type == "text"))

        # Build payload matching public."Questions" schema
        payload = {
            "question_title": meta["question_title"],
            "year_of_question": meta["year_of_question"],
            "question_content": question_content,
            "question_solution": question_solution,
            "subject": "H2 Math",  # Default match
        }

        print(payload, flush=True)

        # Insert into Supabase
        try:
            response = supabase.table("Questions").insert(payload).execute()
            if response.data:
                inserted_id = response.data[0]["id"]
                print(f"  [Success] Inserted record ID: {inserted_id}")
        except Exception as e:
            print(f"  [Error] Failed to insert '{meta['question_title']}': {e}")


if __name__ == "__main__":
    process_question_bank()