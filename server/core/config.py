# app/core/config.py

import os

from pydantic import BaseModel
from supabase import AsyncClient, acreate_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_ANON_KEY", "")
SUPABASE_JWT_SECRET = os.environ.get("SUPABASE_JWT_SECRET", "")


class Settings(BaseModel):
    SUPABASE_URL: str = SUPABASE_URL
    SUPABASE_KEY: str = SUPABASE_KEY
    SUPABASE_JWT_SECRET: str = SUPABASE_JWT_SECRET


settings = Settings()
