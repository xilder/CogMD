import os

from app import app
from fastapi import BackgroundTasks
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import BaseModel, EmailStr
from supabase import AsyncClient


class EmailSchema(BaseModel):
    email: EmailStr
    subject: str
    body: str


conf = ConnectionConfig(
    MAIL_USERNAME=os.environ.get("MAIL_USERNAME", ""),
    MAIL_PASSWORD=os.environ.get("MAIL_PASSWORD", ""),
    MAIL_FROM=os.environ.get("MAIL_FROM", ""),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)


@app.post("/send-email")
async def send_email(email: EmailSchema, background_tasks: BackgroundTasks):

    message = MessageSchema(
        subject=email.subject,
        recipients=[email.email],
        body=email.body,
        subtype=MessageType.html,
    )

    fm = FastMail(conf)
    background_tasks.add_task(fm.send_message, message)

    return {"message": "Email has been queued to be sent"}


async def log_session_questions(
    supabase: AsyncClient, session_id: str, question_ids: list[str]
) -> None:
    """
    A background task to link all questions to a new session in the join table.
    This is a "fire-and-forget" task.
    """
    try:
        if not question_ids:
            print(f"Background task for session {session_id}: No questions to log.")
            return

        print(
            f"Background task: Logging {len(question_ids)} questions for session {session_id}"
        )
        session_question_data = [
            {"session_id": session_id, "question_id": q_id} for q_id in question_ids
        ]
        await supabase.table("session_question").insert(session_question_data).execute()

        print(
            f"Background task for session {session_id}: Successfully logged questions."
        )
    except Exception as e:
        print(f"Error in background task for session {session_id}: {e}")
