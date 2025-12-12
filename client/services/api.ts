// services/api.ts
import { SERVER } from '@/lib/routes';
import {
  ActiveSessionResponse,
  AnswerSubmissionRequest,
  AnswerSubmissionResponse,
  AuthResponse,
  DashboardStatsResponse,
  DashboardSummary,
  NewSessionRequest,
  OAuthCallback,
  QuestionFeedbackResponse,
  SessionCreateResponse,
  SessionResponse,
  User,
  UserCreate,
  UserLogin,
} from '@/types/schemas';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/';

let accessToken: string | null = null;
let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const publicUrls = [
  SERVER.G_CALLBACK,
  SERVER.G_LOGIN,
  SERVER.REGISTER,
  SERVER.LOGIN,
  SERVER.REFRESH_TOKEN,
];
const shouldUseToken = (url: string | undefined) =>
  url ? !publicUrls.some((u) => u.includes(url)) : false;

const config: AxiosRequestConfig = {
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

const api = axios.create(config);

api.interceptors.request.use((config) => {
  if (accessToken && config.headers && !(config as { _retry?: boolean })._retry)
    config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      shouldUseToken(originalRequest.url)
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const { access_token } = await refreshToken();
        if (!access_token) return Promise.reject(error);
        setAccessToken(access_token);

        refreshQueue.forEach((cb) => cb(access_token));
        refreshQueue = [];
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        refreshQueue = [];
        setAccessToken(null);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// --- Authentication Functions ---

export const register = async (userData: UserCreate) => {
  const { data } = await api.post<User>(SERVER.REGISTER, userData);
  return data;
};

export const login = async (credentials: UserLogin) => {
  const { data } = await api.post<AuthResponse>(SERVER.LOGIN, credentials);
  setAccessToken(data.access_token);
  return data;
};

// export const getGoogleAuthUrl = async () => {
//   const { data } = await api.get<{ url: string }>(SERVER.G_LOGIN);
//   return data;
// };

export const handleGoogleCallback = async (callbackData: OAuthCallback) => {
  const { data } = await api.post<AuthResponse>(
    SERVER.G_CALLBACK,
    callbackData
  );
  setAccessToken(data.access_token);
  return data;
};

export const logout = async () => {
  await api.post(SERVER.LOGOUT);
  setAccessToken(null);
};

export const refreshToken = async () => {
  try {
    const { data } = await api.post<{ access_token: string }>(
      SERVER.REFRESH_TOKEN
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async () => {
  const { data } = await api.get<User>(SERVER.PROFILE);
  return data;
};

// --- Quiz and Content Functions ---

export const getTags = async (type: 'SPECIALTY' | 'TOPIC' = 'SPECIALTY') => {
  const { data } = await api.get(SERVER.TAGS, { params: { type } });
  return data as { id: string; name: string; type: string }[];
};

export const startNewSession = async ({
  tag_id = null,
  limit = 20,
}: NewSessionRequest) => {
  const { data } = await api.post<SessionCreateResponse>(SERVER.NEW_SESSION, {
    tag_id,
    limit,
  });
  return data;
};

export const startReviewSession = async ({
  tag_id = null,
  limit = 20,
}: NewSessionRequest) => {
  const { data } = await api.post<SessionCreateResponse>(
    SERVER.REVIEW_SESSION,
    {
      tag_id,
      limit,
    }
  );
  return data;
};
export const startMixedSession = async ({
  tag_id = null,
  limit = 20,
}: NewSessionRequest) => {
  const { data } = await api.post<SessionCreateResponse>(SERVER.MIXED_SESSION, {
    tag_id,
    limit,
  });
  return data;
};

export const resumeSession = async (sessionId: string) => {
  const { data } = await api.get<SessionResponse>(
    SERVER.RESUME_SESSION(sessionId)
  );
  return data;
};

export const submitAnswer = async ({
  sessionId,
  submission,
}: {
  sessionId: string;
  submission: AnswerSubmissionRequest;
}) => {
  const { data } = await api.post<AnswerSubmissionResponse>(
    SERVER.SUBMIT_ANSWER(sessionId),
    submission
  );
  return data;
};

export const getActiveSession = async () => {
  const { data } = await api.get<ActiveSessionResponse | null>(
    SERVER.ACTIVE_SESSION
  );
  return data;
};

export const getAnswer = async (question_id: string) => {
  const { data } = await api.get<QuestionFeedbackResponse>(
    SERVER.GET_ANSWER(question_id)
  );
  return data;
};

// --- NEW Dashboard Function ---

export const getDashboardStats = async () => {
  // This assumes you will create a '/dashboard/stats' endpoint on your backend
  const { data } = await api.get<DashboardStatsResponse>(
    SERVER.DASHBOARD_STATS
  );
  return data;
};

export const getDashboardSummary = async () => {
  const { data } = await api.get<DashboardSummary>(SERVER.DASHBOARD_SUMMARY);
  return data;
};

export default api;
