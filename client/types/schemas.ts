import { z } from 'zod';
// --- Core User Model ---

export type User = {
  /** Represents a user profile in the 'user' table. */
  id: string; // UUID is represented as a string
  username: string | null;
  full_name: string | null;
  email: string;
  plan: 'free' | 'premium';
  xp_points: number;
  created_at: string;
  last_login: string;
  send_email: boolean;
  avatar_url: string | null;
  send_notification: boolean;
};

export interface AuthResponse {
  access_token: string;
  user: User;
}

// --- Core Content Models ---

export const contactUsSchema = z
  .object({
    full_name: z
      .string('')
      .min(3, {
        message: 'Full name must be at least 3 characters long.',
      })
      .trim()
      .regex(/\s+/, {
        message: 'Please enter both a first name and a last name.',
      }),
    email: z.email(),
    message: z.string('').min(10, {
      message: 'Message must be at least 10 characters long.',
    }),
  })


  export type ContactUsForm = z.infer<typeof contactUsSchema>;

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

export const registerSchema = z
  .object({
    full_name: z
      .string('')
      .min(3, {
        message: 'Full name must be at least 3 characters long.',
      })
      .trim()
      .regex(/\s+/, {
        message: 'Please enter both a first name and a last name.',
      }),
    email: z.email(),
    username: z.string(''),
    password: z.string('').min(8, 'Password must be at least 8 characters'),
    confirm_password: z
      .string('')
      .min(8, 'Password must be at least 8 characters'),
    acceptedTermsOfUse: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms of service.',
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export type UserCreate = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(1, 'Please enter your password'),
});

export type UserLogin = z.infer<typeof loginSchema>;

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

export type ActiveSessionResponse = {
  //

  id: string;
  session_type: string;
  created_at: string;
};

export type NewSessionRequest = {
  /** Type for requesting a new learning session. */
  tag_id?: string | null;
  limit?: number;
};

export type QuizOption = {
  /** A public-facing type for an option (omits is_correct). */
  id: string;
  option_text: string;
  is_correct: boolean;
};

export type QuizQuestion = {
  /** A public-facing type for a question, including its options. */
  id: string;
  question_text: string;
  type: 'test' | 'review' | 'tutor';
  options: QuizOption[];
  hint?: string;
  correct_option: string | null;
  explanation?: string;
  option_picked_id?: string;
  is_correct?: boolean;
  time_to_answer_ms: number;
  needs_review?: boolean;
};

export type QuestionImageResponse = {
    id: string,
    question_text: string,
    options: OptionsImageResponse[],
    explanation: string | null
    type: string | null,
    hint: string | null
    correct_option: string | null
}

export type OptionsImageResponse = {
  option_text: string
}

export type SessionResponse = {
  /** Type for the response when a session's questions are requested. */
  session_id: string | null;
  questions: QuizQuestion[];
  timeLeft: number | null;
};

export type SessionCreateResponse = {
  /** Type for the response when a new session is created. */
  session_id: string | null;
};

export type AnswerSubmissionRequest = {
  /** Type for a user submitting an answer to a question. */
  question_id: string;
  selected_option_id: string;
  performance_rating: 'forgot' | 'struggled' | 'recalled' | 'effortless' | null;
  time_to_answer_ms: number;
  completed: boolean;
};

export type AnswerSubmissionResponse = {
  is_correct: boolean;
  correct_option_id: string;
  explanation: string;
};

export type QuestionFeedbackResponse = {
  explanation: string;
  correct_option_id: string;
};

export type TestResult = {
  questionId: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string | null;
  timeToAnswerMs: number;
};

export type ProgressUpdateResponse = {
  /** Type for the response after submitting an answer. */
  message: string;
  is_correct: boolean;
  correct_option_id: string;
  explanation: string;
  new_progress: UserQuestionProgress;
};

export type DashboardSummary = {
  due_for_review_count: number;
  new_questions_count: number;
  graduated_questions_count: number;
};

export type WeeklyProgressItem = {
  day: string;
  correct: number;
  incorrect: number;
};

export interface DashboardStatItem {
  value: number;
  change: number;
}

export type WeeklyAccuracyItem = {
  date: string;
  accuracy: number;
};

export type DashboardStatsResponse = {
  overallProgress: DashboardStatItem;
  questionsAnswered: DashboardStatItem;
  accuracyRate: DashboardStatItem;
  studyStreak: DashboardStatItem;
  weeklyProgress: WeeklyProgressItem[];
  weeklyAccuracy: WeeklyAccuracyItem[];
};

export interface AdminDashboardStats {
  total_users: number;
  daily_active_users: number;
  questions_answered_today: number;
  overall_accuracy_percentage: number;
}

// --- Backend Errors ---
export type BackendError = Error & { response: { data: { detail: string } } };
