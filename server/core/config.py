# app/core/config.py

import os

from pydantic import BaseModel
from supabase import AsyncClient, acreate_client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_ANON_KEY", "")
SUPABASE_JWT_SECRET = os.environ.get("SUPABASE_JWT_SECRET", "")


class Settings(BaseModel):
    SUPABASE_URL: str = SUPABASE_URL
    SUPABASE_KEY: str = SUPABASE_KEY
    SUPABASE_JWT_SECRET: str = SUPABASE_JWT_SECRET


settings = Settings()


async def get_supabase_client() -> AsyncClient:
    """Initializes and returns the asynchronous Supabase client."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase credentials not set.")
    supabase: AsyncClient = await acreate_client(SUPABASE_URL, SUPABASE_KEY)
    return supabase
