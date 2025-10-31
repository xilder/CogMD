# fetch_data.py

import os
import json
import asyncio
from typing import List, Dict, Any
from supabase import Client, create_client, AsyncClient
from dotenv import load_dotenv

# --- Configuration ---
load_dotenv()

# Load Supabase credentials from the.env file
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL and Key must be set in the.env file.")

# --- The Standalone Function ---

async def retrieve_all_rows(table_name: str) -> list:
    """
    Fetches all rows from a specified Supabase table, handling pagination automatically.

    Args:
        table_name: The name of the table to query (e.g., "questions").

    Returns:
        A list of dictionaries, where each dictionary represents a row.
    """
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    all_records: list = []
    page_size = 1000  # Corresponds to the default Supabase limit
    current_page = 0
    
    print(f"Starting to fetch all records from table: '{table_name}'...")

    while True:
        try:
            # 1. Calculate the start and end index for the current page
            start_index = current_page * page_size
            end_index = start_index + page_size - 1

            # 2. Execute the paginated query using.range()
            response = supabase.table(table_name).select("*").range(start_index, end_index).execute()

            # Check for data in the response
            if not response.data:
                # 3. If no data is returned, we have reached the end
                print("No more data to fetch. Loop finished.")
                break

            # 4. Add the fetched records to our master list
            all_records.extend(response.data)
            print(f"Fetched {len(response.data)} records. Total fetched so far: {len(all_records)}")

            # 5. Optimization: If the number of returned rows is less than the page size,
            # it must be the last page, so we can exit the loop early.
            if len(response.data) < page_size:
                print("Last page fetched. Loop finished.")
                break

            # 6. Move to the next page for the next iteration
            current_page += 1

        except Exception as e:
            print(f"An error occurred during pagination: {e}")
            # Re-raise the exception to stop the script on error
            raise

    print(f"\nFinished fetching. Total records retrieved: {len(all_records)}")
    return all_records


# --- Main Execution Block ---

async def main():
    """
    Main function to run the script.
    Specify the table you want to fetch and the output file name.
    """
    TABLE_TO_FETCH = "tags"  # <-- CHANGE THIS to the name of your table
    OUTPUT_FILE_NAME = "all_tags.json"

    try:
        # Call the function to retrieve all rows
        all_data = await retrieve_all_rows(TABLE_TO_FETCH)

        # Save the retrieved data to a JSON file
        with open(OUTPUT_FILE_NAME, 'w', encoding='utf-8') as f:
            json.dump(all_data, f, indent=4, ensure_ascii=False)
        
        print(f"Successfully saved {len(all_data)} records to '{OUTPUT_FILE_NAME}'.")

    except Exception as e:
        print(f"Script failed with an error: {e}")


if __name__ == "__main__":
    # Run the main asynchronous function
    asyncio.run(main())