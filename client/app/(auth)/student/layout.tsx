'use client';
import Loading from '@/app/loading';
import ProtectedRoute from '@/components/auth/protected-route';
import DashboardHeader from '@/components/dashboard-header';
import Sidebar from '@/components/sidebar';
import { getDashboardStats, getDashboardSummary } from '@/services/api';
import {
  DashboardStatsResponse,
  DashboardSummary,
  QuizQuestion,
  TestResult,
} from '@/types/schemas';
import { useQueries } from '@tanstack/react-query';
import { createContext, memo, useCallback, useContext, useState } from 'react';

type QuizQuestionsContext = {
  sessionId: string | null;
  setSessionIdFn: (sessionId: string | null) => void;
  questions: QuizQuestion[];
  setQuestionsFn: (questions: QuizQuestion[]) => void;
  testResult: TestResult[];
  setTestResult: (results: TestResult[]) => void;
  totalTime: string;
  setTotalTime: (time: string) => void;
};
const QuestionsContext = createContext<QuizQuestionsContext | undefined>(
  undefined
);

type DashboardInfo = {
  stats: DashboardStatsResponse | undefined;
  summary: DashboardSummary | undefined;
};

const DashboardContext = createContext<DashboardInfo | undefined>(undefined);

const MemoSidebar = memo(Sidebar);
const MemoDashboardHeader = memo(DashboardHeader);

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const setSessionIdFn = useCallback(
    (id: string | null) => setSessionId(id),
    []
  );
  const setQuestionsFn = useCallback(
    (qs: QuizQuestion[]) => setQuestions(qs),
    []
  );
  const [testResult, setTestResult] = useState<TestResult[]>([]);
  const [totalTime, setTotalTime] = useState<string>('00:00');
  const toggleSidebar = useCallback(() => setSidebarOpen((s) => !s), []);

  const [statsQuery, summaryQuery] = useQueries({
    queries: [
      {
        queryKey: ['dashboard', 'stats'],
        queryFn: getDashboardStats,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['dashboard', 'summary'],
        queryFn: getDashboardSummary,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const statsLoading = statsQuery.isLoading;
  const summaryLoading = summaryQuery.isLoading;

  if (statsLoading || summaryLoading) return <Loading />;

  return (
    <ProtectedRoute>
      <DashboardContext.Provider
        value={{ stats: statsQuery.data, summary: summaryQuery.data }}
      >
        <QuestionsContext.Provider
          value={{ sessionId, setSessionIdFn, questions, setQuestionsFn, testResult, setTestResult, totalTime, setTotalTime }}
        >
          <div className='flex h-screen bg-background'>
            <MemoSidebar
              isOpen={sidebarOpen}
              onToggle={() => toggleSidebar()}
            />

            <div className='flex-1 flex flex-col overflow-y-scroll'>
              {/* <MemoDashboardHeader onMenuClick={() => toggleSidebar()} /> */}
              <div>{children}</div>
            </div>
          </div>
        </QuestionsContext.Provider>
      </DashboardContext.Provider>
    </ProtectedRoute>
  );
};

export const useDashboard = (): DashboardInfo => {
  const ctx = useContext(DashboardContext);
  if (ctx === undefined)
    throw new Error(
      'useDashboard must be used within DashboardContext provider'
    );
  return ctx;
};

export const useQuestionContext = (): QuizQuestionsContext => {
  const ctx = useContext(QuestionsContext);
  if (ctx === undefined)
    throw new Error(
      'useQuestionContext must be used within QuestionsContext provider'
    );
  return ctx;
};

export default memo(StudentLayout);
