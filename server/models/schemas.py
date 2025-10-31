import uuid
from datetime import datetime

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
    username: str | None
    email: EmailStr
    plan: str
    xp_points: int


class Token(BaseModel):
    """Schema for returning JWT access and refresh tokens."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for data decoded from a JWT, used in dependencies."""

    user_id: uuid.UUID | None = None


class OAuthCallback(BaseModel):
    """Schema for handling the OAuth callback from the frontend."""

    code: str
    code_verifier: str


class LoginResponse(BaseModel):
    """Schema for the response on successful login."""
    access_token: str
    token_type: str = "bearer"
    user: UserAuthResponse    


# --- Quiz Session Schemas ---


class NewSessionRequest(BaseModel):
    """Schema for requesting a new learning session."""

    tag_id: uuid.UUID | None = None  # Optional: if null, fetches from any topic
    limit: int = Field(20, gt=0, le=50)


class OptionResponse(BaseModel):
    """A public-facing model for an option (omits the 'is_correct' field)."""

    id: uuid.UUID
    option_text: str


class QuestionResponse(BaseModel):
    """A public-facing model for a question, including its options."""

    id: uuid.UUID
    question_text: str
    options: list


class SessionResponse(BaseModel):
    """Schema for the response when a new session is created."""

    session_id: uuid.UUID
    questions: list


class AnswerSubmissionRequest(BaseModel):
    """Schema for a user submitting an answer to a question."""

    question_id: uuid.UUID
    selected_option_id: uuid.UUID
    performance_rating: str  # e.g., 'forgot', 'good', 'easy'
    time_to_answer_ms: int = Field(gt=0)


class ProgressUpdateResponse(BaseModel):
    """Schema for the response after submitting an answer."""

    message: str
    is_correct: bool
    correct_option_id: uuid.UUID
    explanation: str
    new_progress: UserQuestionProgress
