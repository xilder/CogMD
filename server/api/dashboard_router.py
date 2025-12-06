# app/api/dashboard_router.py

from typing import Annotated, cast

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import AsyncClient

from server.core.dependencies import get_current_user
from server.db.db import get_supabase_client
from server.models.schemas import (
    DashboardStatsResponse,
    DashboardSummary,
    UserAuthResponse,
)

# Initialize the router
router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
# --- API Endpoint ---


@router.get("/me", response_model=UserAuthResponse, summary="Get Current User Profile")
async def get_own_profile(
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
    current_user=Depends(get_current_user),
):
    _profile_response = (
        await supabase.table("user")
        .select("id, full_name, email, username, plan, xp_points")
        .eq("id", current_user.id)
        .single()
        .execute()
    )
    profile_response_data = cast(UserAuthResponse, _profile_response.data)
    return profile_response_data


@router.get("/stats", response_model=DashboardStatsResponse)
async def get_user_dashboard_stats(
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
    current_user=Depends(get_current_user),
):
    """
    Retrieves a comprehensive set of dashboard statistics for the
    currently authenticated user in a single, efficient database call.
    """
    try:
        # Call the RPC function with the user's ID
        rpc_params = {"p_user_id": current_user.id}
        response = await supabase.rpc("get_user_dashboard_stats", rpc_params).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Could not retrieve dashboard stats for the user.",
            ) 
        return response.data

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary(
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
    current_user=Depends(get_current_user),
):
    """
    Get counts of due, new, and learned questions for the user dashboard.
    """
    try:
        # Count questions due for review
        due_response = (
            await supabase.table("user_question_progress")
            .select("question_id", count="exact")
            .eq("user_id", current_user.id)
            .lte("next_review_at", "now()")
            .execute()
        )

        new_questions_count = 50

        # Count graduated questions
        graduated_response = (
            await supabase.table("user_question_progress")
            .select("question_id", count="exact")
            .eq("user_id", current_user.id)
            .eq("status", "graduated")
            .execute()
        )

        return {
            "due_for_review_count": due_response.count,
            "new_questions_count": new_questions_count,
            "graduated_questions_count": graduated_response.count,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
