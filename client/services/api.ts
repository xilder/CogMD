import {
  AnswerSubmissionRequest,
  NewSessionRequest,
  OAuthCallback,
  UserCreate,
  UserLogin,
} from '@/types/schema';
import axios, { AxiosRequestConfig } from 'axios';

const config: AxiosRequestConfig = {
  baseURL: process.env.BASE_URL || 'http://localhost:5000/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const api = axios.create(config);

export const register = async (userData: UserCreate) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

export const login = async (credentials: UserLogin) => {
  const { data } = await api.post('/auth/login', credentials, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data;
};

export const getGoogleAuthUrl = async () => {
  const { data } = await api.get('/auth/google/login');
  return data;
};

export const handleGoogleCallback = async (callbackData: OAuthCallback) => {
  const { data } = await api.post('/auth/google/callback', callbackData);
  return data;
};

export const logout = async () => {
  await api.post('/auth/logout');
};

// --- Quiz and Content Functions ---

export const getTags = async (type?: 'SPECIALTY' | 'TOPIC') => {
  const { data } = await api.get('/quiz/tags', { params: { type } });
  return data;
};

export const startNewSession = async (request: NewSessionRequest) => {
  const { data } = await api.post('/quiz/sessions/new', request);
  return data;
};

export const startReviewSession = async (request: NewSessionRequest) => {
  const { data } = await api.post('/quiz/sessions/review', request);
  return data;
};

export const resumeSession = async (sessionId: string) => {
  const { data } = await api.get(`/quiz/sessions/${sessionId}/resume`);
  return data;
};

export const submitAnswer = async ({
  sessionId,
  submission,
}: {
  sessionId: string;
  submission: AnswerSubmissionRequest;
}) => {
  const { data } = await api.post(
    `/quiz/sessions/${sessionId}/answer`,
    submission
  );
  return data;
};

export default api;
