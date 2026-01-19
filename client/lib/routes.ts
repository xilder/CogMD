const BASE_PATHS = {
  STUDENT: '/student',
  BLOG: '/blog',
  USER: '/user',
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  QUIZ: '/quiz',
};

export const CLIENT = {
  // --- Static Routes ---
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',

  // --- Student Routes ---
  STUDENT: BASE_PATHS.STUDENT,
  DASHBOARD: `${BASE_PATHS.STUDENT}/dashboard`,
  SETTINGS: `${BASE_PATHS.STUDENT}/settings`,
  PROGRESS: `${BASE_PATHS.STUDENT}/progress`,
  STUDY: `${BASE_PATHS.STUDENT}/study`,

  // --- Dynamic Routes (as functions) ---
  SESSION: (mode?: string) =>
    `${BASE_PATHS.STUDENT}/study/session-id${mode ? `?mode=${mode}` : ''}`,
  RESULT: () => `${BASE_PATHS.STUDENT}/study/session-id/result`,
  POST: (slug: string) => `${BASE_PATHS.BLOG}/${slug}`,
  PROFILE: (username: string) => `${BASE_PATHS.USER}/${username}`,
};

export const SERVER = {
  // --- Auth Routes ---
  REGISTER: `${BASE_PATHS.AUTH}/register`,
  LOGIN: `${BASE_PATHS.AUTH}/login`,
  CHANGEPASSWORD: `${BASE_PATHS.AUTH}/change-password`,
  G_LOGIN: `${BASE_PATHS.AUTH}/google/login`,
  G_CALLBACK: `${BASE_PATHS.AUTH}/google/callback`,
  LOGOUT: `${BASE_PATHS.AUTH}/logout`,
  REFRESH_TOKEN: `${BASE_PATHS.AUTH}/refresh-token`,
  TOGGLE_EMAIL_NOTIFICATIONS: `${BASE_PATHS.AUTH}/send-email`,
  TOGGLE_DAILY_REMINDERS: `${BASE_PATHS.AUTH}/send-notification`,

  // --- Dashboard Routes ---
  DASHBOARD_STATS: `${BASE_PATHS.DASHBOARD}/stats`,
  DASHBOARD_SUMMARY: `${BASE_PATHS.DASHBOARD}/summary`,
  PROFILE: `${BASE_PATHS.DASHBOARD}/me`,

  // --- Quiz Routes ---
  TAGS: `${BASE_PATHS.QUIZ}/tags`,
  ACTIVE_SESSION: `${BASE_PATHS.QUIZ}/sessions/active`,
  NEW_SESSION: `${BASE_PATHS.QUIZ}/sessions/new`,
  DELETE_SESSION: (session_id: string) =>
    `${BASE_PATHS.QUIZ}/sessions/${session_id}`,
  REVIEW_SESSION: `${BASE_PATHS.QUIZ}/sessions/review`,
  MIXED_SESSION: `${BASE_PATHS.QUIZ}/sessions/mixed`,

  SUBMIT_ANSWER: (session_id: string) =>
    `${BASE_PATHS.QUIZ}/sessions/${session_id}/answer`,
  RESUME_SESSION: (session_id: string) =>
    `${BASE_PATHS.QUIZ}/sessions/${session_id}/resume`,
  GET_ANSWER: (question_id: string) =>
    `${BASE_PATHS.QUIZ}/questions/${question_id}/feedback`,
  GET_RESULT: (session_id: string) => `${BASE_PATHS.QUIZ}/results/${session_id}`,
  GET_QUESTION_FOR_IMAGE: `${BASE_PATHS.QUIZ}/get-image`,

  // --- Public Routes ---  
  CONTACT_US: '/contact-us',
};
