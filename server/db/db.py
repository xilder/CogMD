import os

from dotenv import load_dotenv
from postgrest import APIResponse
from supabase import AsyncClient, acreate_client


load_dotenv()
SUPABASE_URL = os.getenv('SUPABASE_URL', '')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', '')

async def get_supabase_client() -> AsyncClient:
    """Initializes and returns the asynchronous Supabase client."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase credentials not set.")
    supabase: AsyncClient = await acreate_client(SUPABASE_URL, SUPABASE_KEY)
    try:
    # This executes the query and tries to fetch the result
        result = await supabase.from_('user').select('*').execute()
    
    # If the execution succeeds, the connection is considered alive
    
    except Exception as e:
        print(f"❌ Supabase connection failed: {e}")
    return supabase