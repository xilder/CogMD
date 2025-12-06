import uuid
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, EmailStr, Field

# --- Core User Model ---


class User(BaseModel):
    """Represents a user profile in the 'user' table."""

    id: uuid.UUID
    username: str | None = None
    full_name: str | None = None
    avatar_url: str | None = None
    plan: str = "free"
    xp_points: int = 0
    last_login: datetime | None = None
    created_at: datetime

    class Config:
        from_attributes = True


# --- Core Content Models ---


class Tag(BaseModel):
    """
    Represents a single tag from the 'tags' table.
    This model replaces the separate Specialty, Topic, and RelatedTerm classes.
    """

    id: uuid.UUID
    name: str
    type: str  # 'SPECIALTY', 'TOPIC', or 'RELATED_TERM'

    class Config:
        from_attributes = True


class Option(BaseModel):
    """Represents a single answer option from the 'options' table."""

    id: uuid.UUID
    question_id: uuid.UUID
    option_text: str
    is_correct: bool

    class Config:
        from_attributes = True


class Question(BaseModel):
    """Represents a single question from the 'questions' table."""

    id: uuid.UUID
    question_text: str
    explanation: str
    created_by_user_id: uuid.UUID | None = None
    status: str
    difficulty: str
    times_answered: int
    times_correct: int
    avg_time_to_answer_ms: int | None = None
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        from_attributes = True


class QuizOption(BaseModel):
    id: str
    option_text: str


class QuizQuestion(BaseModel):
    id: str
    question_text: str
    type: Literal[
        "new",
        "review",
    ]
    options: list[QuizOption]
    hint: str | None = None
    answer: str | None = None
    explanation: str | None = None
    option_picked_id: str | None = None
    correct_option: str | None = None
    is_correct: bool | None = None
    time_to_answer_ms: int | None = 0


# --- Core Progress & Session Models ---


class UserQuestionProgress(BaseModel):
    """Represents a user's SRS progress on a single question."""

    user_id: uuid.UUID
    question_id: uuid.UUID
    status: str
    ease_factor: float
    current_interval: int
    repetitions: int
    next_review_at: datetime
    last_reviewed_at: datetime | None = None

    class Config:
        from_attributes = True


class UserQuizSession(BaseModel):
    """Represents a single study session initiated by a user."""

    id: uuid.UUID
    user_id: uuid.UUID
    session_type: str
    started_at: datetime
    completed_at: datetime | None = None

    class Config:
        from_attributes = True


# --- Authentication Schemas ---


class UserCreate(BaseModel):
    """Schema for creating a new user via email/password."""

    email: EmailStr
    password: str
    username: str
    full_name: str | None = None


class UserLogin(BaseModel):
    """Schema for user login."""

    username: EmailStr
    password: str


class UserAuthResponse(BaseModel):
    """Schema for returning essential user info after authentication."""

    id: uuid.UUID
    username: str
    full_name: str
    email: EmailStr
    plan: str = 'free'
    xp_points: int | None


class Token(BaseModel):
    """Schema for returning JWT access tokens."""

    access_token: str


class TokenData(BaseModel):
    """Schema for data decoded from a JWT, used in dependencies."""

    id: str | None = None


class OAuthCallback(BaseModel):
    """Schema for handling the OAuth callback from the frontend."""

    code: str
    code_verifier: str


class LoginResponse(BaseModel):
    """Schema for the response on successful login."""

    access_token: str
    # token_type: str = "bearer"
    user: UserAuthResponse


# --- Quiz Session Schemas ---


class NewSessionRequest(BaseModel):
    """Schema for requesting a new learning session."""

    tag_id: uuid.UUID | None = None
    limit: int = Field(20, gt=0, le=50)


class OptionResponse(BaseModel):
    """A public-facing model for an option."""

    id: uuid.UUID
    option_text: str


class QuestionResponse(BaseModel):
    """A public-facing model for a question, including its options."""

    id: uuid.UUID
    question_text: str
    options: list[dict[str, str]]


class SessionResponse(BaseModel):
    """Schema for the response when a new session is created."""

    session_id: uuid.UUID | None
    questions: list[QuizQuestion | None]


class SessionCreateResponse(BaseModel):
    """Schema for the response when a new session is created."""

    session_id: uuid.UUID


class AnswerSubmissionRequest(BaseModel):
    """Schema for a user submitting an answer to a question."""

    question_id: uuid.UUID
    selected_option_id: uuid.UUID
    performance_rating: str | None = None
    time_to_answer_ms: int = Field(gt=0)
    completed: bool = False


class ProgressUpdateResponse(BaseModel):
    """Schema for the response after submitting an answer."""

    is_correct: bool
    correct_option_id: uuid.UUID
    explanation: str
    # new_progress: UserQuestionProgress


class ActiveSessionResponse(BaseModel):
    """
    Schema for returning the user's most recent unfinished session.
    """

    id: uuid.UUID
    session_type: str
    created_at: str

    class Config:
        from_attributes = True


class QuestionFeedbackResponse(BaseModel):
    """
    Defines the shape of the feedback data returned for a question.
    """

    explanation: str
    correct_option_id: uuid.UUID


# Dashboard view


class DashboardSummary(BaseModel):
    due_for_review_count: int
    new_questions_count: int
    graduated_questions_count: int


class DashboardStatItem(BaseModel):
    value: float
    change: float


class WeeklyProgressItem(BaseModel):
    day: str
    correct: int
    incorrect: int


class DashboardStatsResponse(BaseModel):
    overallProgress: DashboardStatItem
    questionsAnswered: DashboardStatItem
    accuracyRate: DashboardStatItem
    studyStreak: DashboardStatItem
    weeklyProgress: list[Any]
    weeklyAccuracy: list[float]
