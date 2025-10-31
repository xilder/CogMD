# app/api/dashboard_router.py

from typing import Annotated

from core.config import get_supabase_client
from core.dependencies import get_current_user
from fastapi import APIRouter, Depends, HTTPException
# from models.schemas import UserResponse
from pydantic import BaseModel
from supabase import AsyncClient

router = APIRouter()


class DashboardSummary(BaseModel):
    due_for_review_count: int
    new_questions_count: int
    graduated_questions_count: int


@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary(
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
    current_user = Depends(get_current_user),
):
    """
    Get counts of due, new, and learned questions for the user dashboard.
    """
    user_id = current_user.id

    try:
        # Count questions due for review
        due_response = (
            await supabase.table("user_question_progress")
            .select("question_id", count="exact")
            .eq("user_id", str(user_id))
            .lte("next_review_at", "now()")
            .execute()
        )

        # Count new questions (not yet in progress)
        # This is a more complex query, for simplicity we'll return a placeholder
        # A real implementation might require a DB function or more complex logic
        new_questions_count = 50  # Placeholder

        # Count graduated questions
        graduated_response = (
            await supabase.table("user_question_progress")
            .select("question_id", count="exact")
            .eq("user_id", str(user_id))
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
