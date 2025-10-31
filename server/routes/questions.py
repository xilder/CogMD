from datetime import datetime, timedelta
from typing import Literal
from uuid import UUID, uuid4

from fastapi import APIRouter, Body, Depends, HTTPException, Path, Query
from pydantic import BaseModel, Field

# from regex import E
from server.db.db import get_supabase_client


class Question(BaseModel):
    user_id: str
    created_at: str
    options: list[UUID] = Field(default_factory=list)
    specialties: list[str] = Field(default_factory=list)
    answer: str
    explanation: str | None = None
    related_terms: list[str] = Field(default_factory=list)
    related_topics: list[str] = Field(default_factory=list)
    related_conditions: list[str] = Field(default_factory=list)
    question: str
    question_type: str = "mcq"
    difficulty: Literal["easy", "medium", "hard"] = "easy"
    number_of_times_asked: int = 0
    nummber_of_times_answered_correctly: int = 0
    average_score: float = 0.0


class Topic(BaseModel):
    name: str


class Specialty(BaseModel):
    name: str


class RelatedTerm(BaseModel):
    name: str


class Option(BaseModel):
    question_id: str
    text: str
    is_correct: bool = False
    option: str


class UserQuestionProgress(BaseModel):
    user_id: str
    question_id: str
    status: Literal["new", "learning", "graduated", "lapsed"] = "new"
    ease_factor: float
    current_interval: int
    repetitions: int
    next_review_at: str
    last_reviewed_at: str | None = None
    time_taken_to_answer: int


class UserQuizSessions(BaseModel):
    user_id: str
    question_ids: list[str] = Field(default_factory=list)
    session_type: Literal["review", "new_questions", "mock_exams", "specialty"]
    started_at: str
    completed_at: str | None = None
    score: float | None = None


class UserSessionAnswers(BaseModel):
    session_id: str
    question_id: str
    selected_option_id: str
    is_correct: bool
    answered_at: str
    specialty_id: str


questions_router = APIRouter()


@questions_router.post("/questions")
async def create_question(question: Question, supabase=Depends(get_supabase_client)):
    result = supabase.table("questions").insert(question.model_dump()).execute()
    return result.data[0]


@questions_router.get("/questions/{question_id}")
async def get_question(question_id: str, supabase=Depends(get_supabase_client)):
    result = supabase.table("questions").select("*").eq("id", question_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Question not found")
    return result.data[0]


@questions_router.get("/questions")
async def list_questions(supabase=Depends(get_supabase_client)):
    result = supabase.table("questions").select("*").execute()
    return result.data


@questions_router.put("/questions/{question_id}")
async def update_question(
    question_id: str, question: Question, supabase=Depends(get_supabase_client)
):
    result = (
        supabase.table("questions")
        .update(question.model_dump())
        .eq("id", question_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Question not found")
    return result.data[0]


@questions_router.delete("/questions/{question_id}")
async def delete_question(question_id: str, supabase=Depends(get_supabase_client)):
    result = supabase.table("questions").delete().eq("id", question_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"message": "Question deleted successfully"}


@questions_router.get("/topics")
async def get_topics(supabase=Depends(get_supabase_client)):
    result = supabase.table("topics").select("*").execute()
    return result.data or []


@questions_router.get("/topics/{topic_name}")
async def get_questions_by_topic(
    topic_name: str, supabase=Depends(get_supabase_client)
):
    result = (
        supabase.table("questions")
        .select("*")
        .contains("related_topics", [topic_name])
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="No questions found for topic")
    return result.data


@questions_router.get("/related-terms/{term}")
async def get_related_terms(term: str, supabase=Depends(get_supabase_client)):
    result = supabase.table("questions").select(term).execute()
    terms = set()
    for row in result.data or []:
        items = row.get("related_terms") or []
        terms.update(items)
    return sorted(terms)


class CreateSessionResponse(BaseModel):
    session_id: str
    first_question: dict | None


class NewSessionParams(BaseModel):
    user_id: str
    n: int = 10


class AnswerPayload(BaseModel):
    question_id: str
    answer_id: str
    performance_rating: Literal["again", "hard", "good", "easy"]


def _now_iso():
    return datetime.now().isoformat()


def _days_from_now_iso(days: int):
    return (datetime.now() + timedelta(days=days)).isoformat()


@questions_router.post("/api/v1/sessions/review")
async def create_review_session(
    user_id: str = Query(
        ..., description="User id for whom to create the review session"
    ),
    supabase=Depends(get_supabase_client),
):
    # find due question_ids for this user
    now_iso = _now_iso()
    progress_res = (
        supabase.table("user_question_progress")
        .select("question_id")
        .eq("user_id", user_id)
        .lte("next_review_at", now_iso)
        .execute()
    )
    due_qids = [r["question_id"] for r in (progress_res.data or [])]

    # if nothing due, return empty session
    session_id = str(uuid4())
    session_record = {
        "id": session_id,
        "user_id": user_id,
        "question_ids": due_qids,
        "session_type": "review",
        "started_at": now_iso,
        "current_index": 0,
    }
    supabase.table("user_quiz_sessions").insert(session_record).execute()

    first_q = None
    if due_qids:
        qres = supabase.table("questions").select("*").eq("id", due_qids[0]).execute()
        first_q = qres.data[0] if qres.data else None

    return {"session_id": session_id, "first_question": first_q}


@questions_router.post("/api/v1/sessions/new/{topic_id}")
async def create_new_topic_session(
    topic_id: str = Path(..., description="Topic id / name"),
    params: NewSessionParams = Body(...),
    supabase=Depends(get_supabase_client),
):
    user_id = params.user_id
    n = params.n

    # fetch topic questions
    qres = (
        supabase.table("questions")
        .select("*")
        .contains("related_topics", [topic_id])
        .execute()
    )
    topic_questions = qres.data or []

    # fetch user's seen question ids
    prog_res = (
        supabase.table("user_question_progress")
        .select("question_id")
        .eq("user_id", user_id)
        .execute()
    )
    seen = {r["question_id"] for r in (prog_res.data or [])}

    # pick new ones
    new_questions = [q for q in topic_questions if q["id"] not in seen]
    selected = new_questions[:n]
    qids = [q["id"] for q in selected]

    session_id = str(uuid4())
    session_record = {
        "id": session_id,
        "user_id": user_id,
        "question_ids": qids,
        "session_type": "new_questions",
        "started_at": _now_iso(),
        "current_index": 0,
    }
    supabase.table("user_quiz_sessions").insert(session_record).execute()

    first_q = selected[0] if selected else None
    return {"session_id": session_id, "first_question": first_q}


@questions_router.get("/api/v1/sessions/{session_id}/next-question")
async def get_next_question(session_id: str, supabase=Depends(get_supabase_client)):
    sres = (
        supabase.table("user_quiz_sessions").select("*").eq("id", session_id).execute()
    )
    if not sres.data:
        raise HTTPException(status_code=404, detail="Session not found")
    session = sres.data[0]
    qids = session.get("question_ids") or []
    idx = session.get("current_index", 0)

    if idx >= len(qids):
        # mark completed_at if not already
        if not session.get("completed_at"):
            supabase.table("user_quiz_sessions").update(
                {"completed_at": _now_iso()}
            ).eq("id", session_id).execute()
        raise HTTPException(status_code=404, detail="No more questions in session")

    qid = qids[idx]
    qres = supabase.table("questions").select("*").eq("id", qid).execute()
    if not qres.data:
        raise HTTPException(status_code=404, detail="Question not found")
    return qres.data[0]


@questions_router.post("/api/v1/sessions/{session_id}/answer")
async def submit_answer(
    session_id: str,
    payload: AnswerPayload,
    supabase=Depends(get_supabase_client),
):
    # load session
    sres = (
        supabase.table("user_quiz_sessions").select("*").eq("id", session_id).execute()
    )
    if not sres.data:
        raise HTTPException(status_code=404, detail="Session not found")
    session = sres.data[0]
    user_id = session["user_id"]

    question_id = payload.question_id
    answer_id = payload.answer_id
    rating = payload.performance_rating

    # determine if selected option is correct
    opt_res = supabase.table("options").select("*").eq("id", answer_id).execute()
    if not opt_res.data:
        raise HTTPException(status_code=404, detail="Answer option not found")
    is_correct = bool(opt_res.data[0].get("is_correct", False))

    # record the answer in user_session_answers
    ans_record = {
        "id": str(uuid4()),
        "session_id": session_id,
        "question_id": question_id,
        "selected_option_id": answer_id,
        "is_correct": is_correct,
        "answered_at": _now_iso(),
    }
    supabase.table("user_session_answers").insert(ans_record).execute()

    # load or create user_question_progress
    up_res = (
        supabase.table("user_question_progress")
        .select("*")
        .eq("user_id", user_id)
        .eq("question_id", question_id)
        .execute()
    )
    if up_res.data:
        progress = up_res.data[0]
        progress_id = progress["id"]
        ef = float(progress.get("ease_factor", 2.5) or 2.5)
        reps = int(progress.get("repetitions", 0) or 0)
        interval = int(progress.get("current_interval", 0) or 0)
    else:
        progress_id = None
        ef = 2.5
        reps = 0
        interval = 0

    # map rating to SM-2 quality (0-5)
    rating_map = {"again": 0, "hard": 3, "good": 4, "easy": 5}
    quality = rating_map.get(rating, 0)

    # SM-2 algorithm
    if quality < 3:
        reps = 0
        interval = 1
    else:
        reps += 1
        if reps == 1:
            interval = 1
        elif reps == 2:
            interval = 6
        else:
            interval = round(interval * ef) if interval > 0 else 1

    # update ease factor
    ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    if ef < 1.3:
        ef = 1.3

    next_review = _days_from_now_iso(interval)

    progress_payload = {
        "user_id": user_id,
        "question_id": question_id,
        "status": "learning" if reps < 5 else "graduated",
        "ease_factor": ef,
        "current_interval": interval,
        "repetitions": reps,
        "next_review_at": next_review,
        "last_reviewed_at": _now_iso(),
    }

    if progress_id:
        supabase.table("user_question_progress").update(progress_payload).eq(
            "id", progress_id
        ).execute()
    else:
        # create new progress row
        supabase.table("user_question_progress").insert(progress_payload).execute()

    # update question aggregate stats (attempts, correct)
    qres = supabase.table("questions").select("*").eq("id", question_id).execute()
    if qres.data:
        q = qres.data[0]
        times_asked = int(q.get("number_of_times_asked", 0) or 0) + 1
        times_correct = int(q.get("nummber_of_times_answered_correctly", 0) or 0) + (
            1 if is_correct else 0
        )
        avg_score = (times_correct / times_asked) if times_asked else 0.0
        supabase.table("questions").update(
            {
                "number_of_times_asked": times_asked,
                "nummber_of_times_answered_correctly": times_correct,
                "average_score": avg_score,
            }
        ).eq("id", question_id).execute()

    # advance session current_index if this question was the current one
    qids = session.get("question_ids") or []
    idx = session.get("current_index", 0)
    if idx < len(qids) and qids[idx] == question_id:
        new_idx = idx + 1
        update_payload = {"current_index": new_idx}
        if new_idx >= len(qids):
            update_payload["completed_at"] = _now_iso()
        supabase.table("user_quiz_sessions").update(update_payload).eq(
            "id", session_id
        ).execute()

    return {"result": "ok", "is_correct": is_correct, "next_review_at": next_review}
