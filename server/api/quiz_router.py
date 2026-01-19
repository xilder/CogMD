# app/api/quiz_router.py

import os
import uuid
from os import error
from pprint import pprint
from typing import Annotated, Any, cast
from urllib import response

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status, Response
from postgrest import APIResponse
from supabase import AsyncClient
import requests

# Import the correct, full dependency functions and new schemas
from server.core.dependencies import get_current_user
from server.db.db import get_supabase_client
from server.models.schemas import (
    ActiveSessionResponse,
    AnswerSubmissionRequest,
    NewSessionRequest,
    ProgressUpdateResponse,
    QuestionFeedbackResponse,
    QuestionForImageParams,
    QuestionResponse,
    SessionCreateResponse,
    SessionResponse,
    TestResult,
)

router = APIRouter(prefix="/quiz", tags=["Quiz"])


# --- Background Task for Performance Optimization ---


async def log_session_questions(
    supabase: AsyncClient, session_id: uuid.UUID, question_ids: list[str]
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


@router.get(
    "/sessions/active",
    response_model=ActiveSessionResponse | None,
    summary="Check for an unfinished session",
)
async def check_for_active_session(
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
    current_user=Depends(get_current_user),
):
    """
    Checks if the currently authenticated user has any quiz sessions
    that were started but not completed.

    This is used to prompt the user to "pick up where they left off".

    It returns the most recent active session, or null if none are found.
    """
    user_id = current_user.id
    try:
        # Query the user_quiz_sessions table
        response = (
            await supabase.table("user_quiz_sessions")
            .select("id, session_type, created_at")
            .eq("user_id", user_id)
            .is_("completed_at", "null")
            .order("created_at", desc=True)
            .execute()
        )

        if len(response.data) == 0:
            return None

        if not response.data[0]:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="You have no unfinished session",
            )
        return response.data[0]

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching active session: {str(e)}",
        )


@router.post("/sessions/new", response_model=SessionCreateResponse)
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
    user_id = current_user.id
    try:
        rpc_params = {
            "p_user_id": user_id,
            "p_tag_id": str(request_body.tag_id) if request_body.tag_id else None,
            "p_limit": request_body.limit,
        }
        session_res = await supabase.rpc(
            "get_new_questions_for_user", rpc_params
        ).execute()
        session_id = session_res.data

        if not session_res.data:
            return SessionResponse(session_id=session_id, questions=[])

        return SessionCreateResponse(session_id=session_id)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.post("/sessions/review", response_model=SessionCreateResponse)
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
    user_id = current_user.id
    try:
        rpc_params = {
            "p_user_id": user_id,
            "p_tag_id": str(request_body.tag_id) if request_body.tag_id else None,
            "p_limit": request_body.limit,
        }
        session_res = await supabase.rpc(
            "get_due_review_questions_for_user", rpc_params
        ).execute()
        session_id = session_res.data

        if not session_res.data:
            return SessionResponse(session_id=session_id, questions=[])

        return SessionCreateResponse(session_id=session_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.post("/sessions/mixed", response_model=SessionCreateResponse)
async def create_smart_session(
    background_tasks: BackgroundTasks,
    request_body: NewSessionRequest,
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
    current_user=Depends(get_current_user),
):
    """
    Creates a new learning session with questions the user has not seen before.
    Uses an optimized RPC that returns full question objects in one call.
    """
    user_id = str(current_user.id)
    try:
        # 2. Call the RPC to get new questions
        rpc_params = {
            "p_user_id": user_id,
            "p_tag_id": str(request_body.tag_id) if request_body.tag_id else None,
            "p_limit": request_body.limit if request_body.limit else 20,
        }
        session_res = await supabase.rpc(
            "create_smart_session_for_user", rpc_params
        ).execute()
        session_id = session_res.data

        if not session_res.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create smart session.",
            )
        return SessionCreateResponse(session_id=uuid.UUID(session_id))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
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
            "p_user_id": str(current_user.id),
            "p_session_id": str(session_id),
            "p_question_id": str(submission.question_id),
            "p_selected_option_id": str(submission.selected_option_id),
            "p_performance_rating": submission.performance_rating,
            "p_time_to_answer_ms": submission.time_to_answer_ms,
            "p_completed": (
                submission.completed if submission.completed is not None else False
            ),
        }

        # 2. Make a single, atomic call to the database function
        response = await supabase.rpc("process_answer_submission", rpc_params).execute()

        if not response.data:
            pprint(response.data["error"])
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=(
                    response.data["error"]
                    if "error" in response.data
                    else "Failed to process answer and update progress."
                ),
            )

        _result = response.data
        result = cast(dict[str, Any], _result)
        return ProgressUpdateResponse(
            is_correct=result["is_correct"],
            correct_option_id=result["correct_option_id"],
            explanation=result["explanation"],
        )
    except Exception as e:
        pprint(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.delete("/sessions/{session_id}", status_code=status.HTTP_200_OK)
async def delete_quiz_session(
    session_id: uuid.UUID,
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
    current_user=Depends(get_current_user),
):
    """
    Deletes a quiz session and all associated data for the current user.
    """
    user_id = current_user.id
    try:
        delete_res = (
            await supabase.table("user_quiz_sessions")
            .delete()
            .eq("id", str(session_id))
            .eq("user_id", user_id)
            .execute()
        )

        if delete_res.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete the session.",
            )

        return {"message": "Session deleted successfully."}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.get("/sessions/{session_id}/resume", response_model=SessionResponse)
async def resume_quiz_session(
    session_id: uuid.UUID,
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
    current_user=Depends(get_current_user),
):
    """
    Resumes an in-progress quiz session.
    """
    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Missing session ID.",
        )
    user_id = current_user.id
    try:
        # First, verify that the session belongs to the current user for security.
        session_owner_res = (
            await supabase.table("user_quiz_sessions")
            .select("user_id")
            .eq("id", str(session_id))
            .single()
            .execute()
        )
        if (
            not session_owner_res.data
            or session_owner_res.data.get("user_id") != user_id
        ):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found or access denied.",
            )

        rpc_params = {"p_session_id": str(session_id), "p_user_id": str(user_id)}
        unanswered_questions_res = await supabase.rpc(
            "get_unanswered_questions_for_session", rpc_params
        ).execute()

        questions_data = (
            unanswered_questions_res.data if unanswered_questions_res.data else []
        )
        # pprint(f'Session ID: {session_id}\nQuestions: {questions_data}')

        return SessionResponse(session_id=session_id, questions=questions_data)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.get(
    "/questions/{question_id}/feedback",
    response_model=QuestionFeedbackResponse,
    summary="Get Answer Feedback for a Question",
)
async def get_question_feedback(
    question_id: uuid.UUID,
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
    current_user=Depends(get_current_user),
):
    """
    Retrieves the correct option ID and the detailed explanation for a
    specific question. This is a protected route.

    This is typically called a user has submitted an answer
    in a mode like "Test" or "Tutor" where feedback is not immediate.
    """
    try:
        # Call the RPC function we created in Step 1
        rpc_params = {"p_question_id": str(question_id)}
        response = await supabase.rpc("get_question_feedback", rpc_params).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feedback not found for this question.",
            )
        return response.data

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.get("/results/{session_id}", response_model=list[TestResult])
async def get_session_result(
    session_id: uuid.UUID,
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
    current_user=Depends(get_current_user),
):
    """"""
    try:
        rpc_params = {
            "p_session_id": str(session_id),
            "p_user_id": str(current_user.id),
        }
        response = await supabase.rpc("get_session_results", rpc_params).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Could not retrieve session result.",
            )
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


# @router.get("/get-image")
# async def get_image(
#     supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
#     question_for_image_params: QuestionForImageParams,
# ):
#     image_url = f'{os.environ.get("ORIGIN_URL", "")}/api/os'
#     try:
#         rpc_params = {
#             "p_tag_id": question_for_image_params.tag_id,
#             "p_question_id": question_for_image_params.tag_id,
#         }
#         response = await supabase.rpc("get_question_for_image", rpc_params).execute()
#         if not response.data:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Could not retrieve session result.",
#             )
#         params = {
#             "question_text": response.data.question_text,
#             "id": response.data.id,
#             'a': response.data.options[0].option_text,
#             'b': response.data.options[1].option_text,
#             'c': response.data.options[2].option_text,
#             'd': response.data.options[3].option_text,
#             'e': response.data.options[4].option_text,
#         }

#         file_name = f"{uuid.uuid4()}.png"

#         image = await fetch_og_image(image_url, file_name, params)
            
#         return Response(content=image, media_type="image", headers={"Content-Disposition": f"attachment; filename='{file_name}"}) 
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
#         )

# async def fetch_og_image(image_url, output_filename, params=None):

#     headers = {
#         'User-Agent': 'Python-OG-Fetcher/1.0'    }
    
#     try:
#         print(f"Requesting Image from: {image_url}")
#         response = requests.get(image_url, params=params, headers=headers, stream=True, timeout=10000)
#         response.raise_for_status()

#         with open(output_filename, 'wb') as f:
#             for chunk in response.iter_content(chunk_size=8192):
#                 f.write(chunk)

#             print("Success!")
#         return response.content
#     except requests.exceptions.HTTPError as err:
#         print(f"HTTP Error: {err}")
#     except Exception as err:
#         print(f"An Error: {err}")
