// --- Core User Model ---

export type User = {
  /** Represents a user profile in the 'user' table. */
  id: string; // UUID is represented as a string
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  plan: 'free' | 'premium';
  xp_points: number;
  created_at: string;
};

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// --- Core Content Models ---

export type Tag = {
  /**
   * Represents a single tag from the 'tags' table.
   */
  id: string;
  name: string;
  type: 'SPECIALTY' | 'TOPIC' | 'RELATED_TERM';
};

export type Option = {
  /** Represents a single answer option from the 'options' table. */
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
};

export type Question = {
  /** Represents a single question from the 'questions' table. */
  id: string;
  question_text: string;
  explanation: string;
  created_by_user_id: string | null;
  status: 'draft' | 'published' | 'archived' | 'flagged';
  difficulty: 'easy' | 'medium' | 'hard';
  times_answered: number;
  times_correct: number;
  avg_time_to_answer_ms: number | null;
  created_at: string;
  updated_at: string | null;
};

// --- Core Progress & Session Models ---

export type UserQuestionProgress = {
  /** Represents a user's SRS progress on a single question. */
  user_id: string;
  question_id: string;
  status: 'new' | 'learning' | 'graduated' | 'lapsed';
  ease_factor: number;
  current_interval: number;
  repetitions: number;
  next_review_at: string;
  last_reviewed_at: string | null;
};

export type UserQuizSession = {
  /** Represents a single study session initiated by a user. */
  id: string;
  user_id: string;
  session_type: 'review' | 'new_learning' | 'custom_practice';
  started_at: string;
  completed_at: string | null;
};


// --- Authentication Schemas ---

export type UserCreate = {
  /** Type for creating a new user via email/password. */
  email: string;
  password: string;
  username: string;
  full_name?: string | null;
};

export type UserLogin = {
  /** Type for user login (will be serialized to form-data). */
  username: string; 
  password: string;
};

export type UserAuthResponse = {
  /** Type for the user profile object returned after authentication. */
  id: string;
  username: string | null;
  email: string;
  plan: string;
  xp_points: number;
};

export type LoginResponse = {
  /** Type for the combined response on successful login. */
  access_token: string;
  user: UserAuthResponse;
};

export type OAuthCallback = {
  /** Type for handling the OAuth callback from the frontend. */
  code: string;
  code_verifier: string;
};

// --- Quiz Session Schemas ---

export type NewSessionRequest = {
  /** Type for requesting a new learning session. */
  tag_id?: string | null;
  limit?: number;
};

export type OptionResponse = {
  /** A public-facing type for an option (omits is_correct). */
  id: string;
  option_text: string;
};

export type QuestionResponse = {
  /** A public-facing type for a question, including its options. */
  id: string;
  question_text: string;
  options: OptionResponse;
};

export type SessionResponse = {
  /** Type for the response when a new session is created. */
  session_id: string;
  questions: QuestionResponse;
};

export type AnswerSubmissionRequest = {
  /** Type for a user submitting an answer to a question. */
  question_id: string;
  selected_option_id: string;
  performance_rating: "forgot" | "good" | "easy";
  time_to_answer_ms: number;
};

export type ProgressUpdateResponse = {
  /** Type for the response after submitting an answer. */
  message: string;
  is_correct: boolean;
  correct_option_id: string;
  explanation: string;
  new_progress: UserQuestionProgress;
};