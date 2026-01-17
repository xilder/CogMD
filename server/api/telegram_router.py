# app/api/dashboard_router.py

from typing import Annotated, cast

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import AsyncClient
from postgrest import APIResponse


from server.core.dependencies import get_current_user
from server.db.db import get_supabase_client
from server.models.schemas import (
    DashboardStatsResponse,
    DashboardSummary,
    UserAuthResponse,
)

# Initialize the router
router = APIRouter(prefix="/telegram", tags=["Telegram"])
# --- API Endpoint ---

@router.get("/start", response_model=list)
async def start_telegram_integration(
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
    current_user: Annotated[UserAuthResponse, Depends(get_current_user)],
):

    try:
        _response = (
            await supabase.table("tags")
            .select("id", "name")
            .execute()
        )

        response = cast(APIResponse, _response)
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


# @router.get("/")        