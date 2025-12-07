import os
from supabase import AsyncClient, acreate_client
SUPABASE_URL = os.getenv('SUPABASE_URL', '')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', '')

async def get_supabase_client() -> AsyncClient:
    """Initializes and returns the asynchronous Supabase client."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase credentials not set.")
    supabase: AsyncClient = await acreate_client(SUPABASE_URL, SUPABASE_KEY)
    try:
        await supabase.from_('user').select('*').limit(1).execute()
    
    except Exception as e:
        print(f"❌ Supabase connection failed: {e}")
    return supabase