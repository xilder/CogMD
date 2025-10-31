# app/api/quiz_router.py

import uuid
from typing import Annotated, Any, cast

# Import the correct, full dependency functions and new schemas
from core.dependencies import get_current_user
from db.db import get_supabase_client
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from models.schemas import (
    AnswerSubmissionRequest,
    NewSessionRequest,
    ProgressUpdateResponse,
    SessionResponse,
)
from postgrest import APIResponse
from supabase import AsyncClient

router = APIRouter(prefix="/quiz", tags=["Quiz"])


# --- Background Task for Performance Optimization ---


async def log_session_questions(
    supabase: AsyncClient, session_id: uuid.UUID, question_ids: list
) -> None:
    """
    A background task to link all questions to a new session in the join table.
    This is a "fire-and-forget" task that runs after the response is sent.
    """
    try:
        if not question_ids:
            return

        session_question_data = [
            {"session_id": str(session_id), "question_id": str(q_id)}
            for q_id in question_ids
        ]
        await supabase.table("session_question").insert(session_question_data).execute()

    except Exception as e:
        # For production, you would use a proper logger here
        print(f"Error in background task for session {session_id}: {e}")


# --- API Endpoints ---


@router.get("/tags", response_model=list)
async def get_all_tags(
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
    # current_user=Depends(get_current_user),
    type: str | None = None,
):
    """
    Get a list of all available tags, optionally filtered by type.
    Valid types are 'SPECIALTY', 'TOPIC', 'RELATED_TERM'.
    """
    try:
        _response = (
            await supabase.table("tags")
            .select("id", "name")
            .eq("type", type.upper())
            .execute()
            if type
            else await supabase.table("tags").select("id, name, type").execute()
        )

        response = cast(APIResponse, _response)
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.post("/sessions/new", response_model=SessionResponse)
async def create_new_learning_session(
    background_tasks: BackgroundTasks,
    request_body: NewSessionRequest,
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
    current_user=Depends(get_current_user),
):
    """
    Creates a new learning session with questions the user has not seen before.
    Uses an optimized RPC that returns full question objects in one call.
    """
    user_id = str(current_user.user_id)
    try:
        # 1. Create the session record immediately to get a session_id
        _session_res = (
            await supabase.table("user_quiz_sessions")
            .insert({"user_id": user_id, "session_type": "new_learning"})
            .execute()
        )
        session_res = cast(APIResponse, _session_res)
        session_data = cast(dict[str, str], session_res.data[0])
        session_id = uuid.UUID(session_data["id"])

        # 2. Call the RPC to get new questions
        rpc_params = {
            "p_user_id": user_id,
            "p_tag_id": str(request_body.tag_id) if request_body.tag_id else None,
            "p_limit": request_body.limit,
        }
        questions_res = await supabase.rpc(
            "get_new_questions_for_user", rpc_params
        ).execute()

        if not questions_res.data:
            return SessionResponse(session_id=session_id, questions=[])

        questions_data = cast(list[Any], questions_res.data)

        # 3. Schedule the background task to log the questions to the session
        question_ids = [q["id"] for q in questions_data]
        background_tasks.add_task(
            log_session_questions, supabase, session_id, question_ids
        )

        # 4. Return the session ID and questions to the user immediately
        return SessionResponse(session_id=session_id, questions=questions_data)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.post("/sessions/review", response_model=SessionResponse)
async def create_review_session(
    background_tasks: BackgroundTasks,
    request_body: NewSessionRequest,
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
    current_user=Depends(get_current_user),
):
    """
    Creates a new review session with all questions currently due for the user.
    Uses an optimized RPC to fetch all data in a single database operation.
    """
    user_id = str(current_user.user_id)
    try:
        # 1. Create the session record immediately
        _session_res = (
            await supabase.table("user_quiz_sessions")
            .insert({"user_id": user_id, "session_type": "review"})
            .execute()
        )
        session_res = cast(APIResponse, _session_res)
        session_data = cast(list[Any], session_res.data)
        session_id = uuid.UUID(session_data[0]["id"])

        # 2. Call the RPC to get all due questions and their options
        rpc_params = {
            "p_user_id": user_id,
            "p_tag_id": str(request_body.tag_id) if request_body.tag_id else None,
            "p_limit": request_body.limit,
        }
        due_questions_res = await supabase.rpc(
            "get_due_review_questions", rpc_params
        ).execute()

        _questions_data = due_questions_res.data if due_questions_res.data else []
        questions_data = cast(list[Any], _questions_data)

        # 3. Schedule the background task to log the questions
        question_ids = [q["id"] for q in questions_data]
        background_tasks.add_task(
            log_session_questions, supabase, session_id, question_ids
        )

        # 4. Return the response to the user immediately
        return SessionResponse(session_id=session_id, questions=questions_data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.post("/sessions/{session_id}/answer", response_model=ProgressUpdateResponse)
async def submit_answer(
    session_id: uuid.UUID,
    submission: AnswerSubmissionRequest,
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
    current_user=Depends(get_current_user),
):
    """
    Submits an answer by calling a single, optimized database function
    that handles all data manipulation atomically and returns feedback.
    """
    try:
        # 1. Prepare parameters for the RPC call
        rpc_params = {
            "p_user_id": str(current_user.user_id),
            "p_session_id": str(session_id),
            "p_question_id": str(submission.question_id),
            "p_selected_option_id": str(submission.selected_option_id),
            "p_performance_rating": submission.performance_rating,
            "p_time_to_answer_ms": submission.time_to_answer_ms,
        }

        # 2. Make a single, atomic call to the database function
        response = await supabase.rpc("process_answer_submission", rpc_params).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to process answer and update progress.",
            )

        # 3. The RPC returns all the data we need for the response
        _result = response.data
        result = cast(dict[str, Any], _result)
        return ProgressUpdateResponse(
            message="Answer processed successfully",
            is_correct=result["is_correct"],
            correct_option_id=result["correct_option_id"],
            explanation=result["explanation"],
            new_progress=result["new_progress"],
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.get("/sessions/{session_id}/resume", response_model=SessionResponse)
async def resume_quiz_session(
    session_id: uuid.UUID,
    supabase: Annotated,
    current_user: Annotated,
):
    """
    Resumes an in-progress quiz session.
    Fetches only the questions that the user has not yet answered for this session.
    """
    user_id = str(current_user.user_id)
    try:
        # First, verify that the session belongs to the current user for security.
        session_owner_res = await supabase.table("user_quiz_sessions").select("user_id").eq("id", str(session_id)).single().execute()
        if not session_owner_res.data or session_owner_res.data.get("user_id")!= user_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found or access denied.")

        # Call the RPC function to get the remaining questions.
        rpc_params = {
            "p_session_id": str(session_id),
            "p_user_id": user_id
        }
        unanswered_questions_res = await supabase.rpc("get_unanswered_questions_for_session", rpc_params).execute()

        questions_data = unanswered_questions_res.data if unanswered_questions_res.data else []

        return SessionResponse(session_id=session_id, questions=questions_data)

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))