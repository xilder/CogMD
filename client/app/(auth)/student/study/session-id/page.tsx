'use client';

import Loading from '@/app/loading';
import CountdownTimer from '@/components/countdown-time';
import QuizFeedback from '@/components/quiz-feedback';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CLIENT } from '@/lib/routes';
import { capitaliseWords } from '@/lib/utils';
import {
  deleteSession,
  getAnswer,
  resumeSession,
  submitAnswer,
} from '@/services/api';
import type {
  AnswerSubmissionRequest,
  QuizQuestion,
  TestResult,
} from '@/types/schemas';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Clock, Lightbulb, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuestionContext } from '../../layout';

type QuizMode = 'review' | 'test' | 'tutor';

type QState = {
  id?: string;
  index: number;
  selected?: string | null;
  prevSelected?: string | null;
  showExplanation: boolean;
  showHint: boolean;
  showRating: boolean;
  submitted: boolean;
  time_ms: number;
  question: QuizQuestion | null;
};

type History = Record<string, QState>;

function useQuizTimer(mode: QuizMode) {
  const startRef = useRef<number | null>(null);
  const accumulatedRef = useRef<Record<string, number>>({});
  const MAX_MS = 5 * 60 * 1000;

  const start = (qid?: string) => {
    if (!qid) return;
    if (startRef.current == null) startRef.current = performance.now();
  };

  const stopAndAccumulate = (qid?: string) => {
    if (!qid) return 0;
    if (startRef.current == null) return accumulatedRef.current[qid] ?? 0;
    const now = performance.now();
    let delta = now - startRef.current;
    startRef.current = null;

    const prev = accumulatedRef.current[qid] ?? 0;
    const remaining = Math.max(0, MAX_MS - prev);
    const toAdd = Math.min(delta, remaining);
    const total = prev + toAdd;
    accumulatedRef.current[qid] = total;
    return total;
  };

  const getAccumulated = (qid?: string) =>
    qid ? accumulatedRef.current[qid] : 0;

  return { start, stopAndAccumulate, getAccumulated, accumulatedRef };
}

function buildTestResults(
  h: History,
  answers: Record<string, string | undefined>,
  correctAnswers: Record<string, string | undefined>,
  explanations: Record<string, string | undefined>,
  times: Record<string, number>
) {
  const results = Object.values(h).map((qState) => {
    const q = qState.question as QuizQuestion;
    const userOptionId = answers[q.id];
    const correctOptionId = correctAnswers[q.id];
    const userOption = q.options.find((o) => o.id === userOptionId);
    const correctOption = q.options.find((o) => o.id === correctOptionId);
    return {
      questionId: q.id,
      questionText: q.question_text,
      userAnswer: userOption?.option_text ?? '',
      correctAnswer: correctOption?.option_text ?? '',
      isCorrect:
        !!userOptionId && !!correctOptionId
          ? userOptionId === correctOptionId
          : false,
      explanation: explanations[q.id],
      timeToAnswerMs: times[q.id] ?? 0,
    } as TestResult;
  });
  return results;
}

export default function QuizPageRefactor() {
  let sessId = useQuestionContext().sessionId;
  const [sessionId, setSessionId] = useState<string>(sessId || '');
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get('mode') || 'review').toLowerCase() as QuizMode;
  const { setTestResult, setTotalTime, testResult, totalTime } =
    useQuestionContext();

  // Query to get questions left in the session
  const getSessionID = useCallback(() => {
    if (sessionId) return sessionId;
    const storedId = sessionStorage.getItem('sessionID') || '';
    setSessionId(storedId);
    return storedId;
  }, []);
  const questionsLeft = useQuery({
    queryKey: ['quiz', 'session', 'questions-left', sessionId],
    queryFn: () => resumeSession(getSessionID()),
  });

  const [currIdx, setCurrIdx] = useState(0);
  const [done, setDone] = useState(false);

  // Default QState for reference
  const defaultState: QState = {
    id: undefined,
    index: currIdx,
    selected: null,
    prevSelected: null,
    showExplanation: false,
    showRating: false,
    showHint: false,
    submitted: false,
    time_ms: 0,
    question: null,
  };
  const [qState, setQState] = useState<QState>(defaultState);
  const [history, setHistory] = useState<History>({});

  // Function to update quiz state and history
  const updateQuizState = useCallback(
    (newState: Partial<QState>) => {
      setQState((prev) => ({ ...prev, ...newState }));
      setHistory((prev) => ({
        ...prev,
        [qState.id as string]: { ...prev[qState.id as string], ...newState },
      }));
    },
    [qState.id]
  );
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState<QuizQuestion | null>(null);
  const [seconds, setSeconds] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | undefined>>(
    {}
  );
  const [correctAnswers, setCorrectAnswers] = useState<
    Record<string, string | undefined>
  >({});
  const [explanations, setExplanations] = useState<
    Record<string, string | undefined>
  >({});
  const ratingTypes: AnswerSubmissionRequest['performance_rating'][] = [
    'forgot',
    'struggled',
    'recalled',
    'effortless',
  ];
  const [ratings, setRatings] = useState<
    Record<string, AnswerSubmissionRequest['performance_rating']>
  >({});

  const { start, stopAndAccumulate, getAccumulated, accumulatedRef } =
    useQuizTimer(mode);

  // Mutation to submit answers
  const submitMutation = useMutation({
    mutationFn: submitAnswer,
    onError: (err) => {
      console.error('Error submitting answer:', err);
    },
  });

  // Mutation to check answer and get explanation
  const checkMutation = useMutation({
    mutationFn: getAnswer,
    onSuccess: (data, qid) => {
      setExplanations((p) => ({ ...p, [qid as string]: data.explanation }));
      const update: Partial<QState> = {
        showExplanation: true,
        showRating: mode === 'test' ? false : true, //TODO: check this
      };
      updateQuizState(update);
    },
  });

  useEffect(() => {
    if (questionsLeft.isError) router.replace(CLIENT.STUDY);
  }, []);

  // Initialize questions and history when data is loaded
  useEffect(() => {
    if (!questionsLeft.isSuccess) return;
    if (!questionsLeft.data.questions.length) {
      try {
        (async () => {
          await deleteSession(sessionId);
        })();
      } catch (e) {
        console.error('Error deleting empty session:', e);
      }
      router.replace(CLIENT.STUDY);
      return;
    }
    const data = questionsLeft.data.questions.sort((a, b) =>
      !!a.option_picked_id && !b.option_picked_id
        ? -1
        : !a.option_picked_id && !!b.option_picked_id
        ? 1
        : 0
    ) as QuizQuestion[];
    const h: History = {};
    const a: Record<string, string | undefined> = {};
    const c: Record<string, string | undefined> = {};
    const e: Record<string, string | undefined> = {};

    data.forEach((q, i) => {
      h[q.id] = {
        ...defaultState,
        id: q.id,
        index: i,
        selected: q.option_picked_id ?? null,
        prevSelected: q.option_picked_id ?? null,
        showExplanation: mode === 'test' ? false : !!q.option_picked_id,
        showHint: mode === 'test' ? true : !!q.option_picked_id,
        showRating: mode === 'test' ? true : !!q.option_picked_id,
        submitted: !!q.option_picked_id,
        time_ms: q.time_to_answer_ms ?? 0,
        question: q,
      };
      if (q.option_picked_id) a[q.id] = q.option_picked_id;
      if (q.correct_option) c[q.id] = q.correct_option;
      if (q.explanation) e[q.id] = q.explanation;
    });

    setQuestions(data);
    setHistory(h);
    setAnswers(a);
    setCorrectAnswers(c);
    setExplanations(e);

    const idx = data.findIndex((q) => !q.option_picked_id) ?? 0; //TODO: check this
    setQState(h[data[idx]?.id]);
    setCurrIdx(idx);
    const { timeLeft } = questionsLeft.data;
    const seconds =
      timeLeft ?? 60 * data.filter((q) => !q.option_picked_id).length;
    setSeconds(seconds);
  }, [questionsLeft.isSuccess]);

  // Manage timer for current question
  useEffect(() => {
    const q = qState.question;

    if (!q) return;

    const alreadyAnswered = qState.showExplanation;
    const shouldStartTimer = mode === 'test' || !alreadyAnswered;

    if (shouldStartTimer) start(q.id);

    return () => {
      if (shouldStartTimer) {
        const total = stopAndAccumulate(q.id);
        updateQuizState({ time_ms: Math.round(total) });
      }
    };
  }, [qState.index, questions, answers]);

  // Sync selected answer with answers state
  useEffect(() => {
    const q = qState.question;
    if (!q) return;
    updateQuizState({ selected: answers[q.id] ?? null });
  }, [answers, qState.index, questions]);

  // Update current question when qState index changes
  useEffect(() => {
    const q = qState.question;
    if (!q) return;
    setCurrent(q);
  }, [qState.index, questions]);

  // Handle answer selection
  const handleSelect = useCallback((questionId: string, optionId: string) => {
    setAnswers((p) => ({ ...p, [questionId]: optionId }));
  }, []);

  // Submit answer if changed
  const submitIfChanged = useCallback(
    (q: QuizQuestion, completed: boolean = false) => {
      const stateForQ = history[q.id] ?? null;
      const curAnswer = stateForQ.selected ?? null;
      const prevAnswer = stateForQ?.prevSelected ?? null;

      if (curAnswer && curAnswer !== prevAnswer) {
        const time = Math.round(getAccumulated(q.id));
        const submission: AnswerSubmissionRequest = {
          question_id: q.id,
          selected_option_id: curAnswer,
          performance_rating: ratings[q.id] ?? null,
          time_to_answer_ms: time,
          completed,
        };
        submitMutation.mutate(
          { sessionId, submission },
          {
            onSuccess: (data) => {
              setExplanations((p) => ({ ...p, [q.id]: data.explanation }));
              setCorrectAnswers((p) => ({
                ...p,
                [q.id]: data.correct_option_id,
              }));
              updateQuizState({ prevSelected: curAnswer, submitted: true });
            },
          }
        );
      }
    },
    [answers, history, submitMutation, sessionId, getAccumulated]
  );

  // gets the ID of question from its index
  const findIDfromIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= questions.length) return null;
      const id = Object.values(history).find(
        (qState) => qState.index === index
      )?.id;
      return id ?? null;
    },
    [questions, history]
  );

  // Navigate to a specific question by index
  const goTo = useCallback(
    (index: number) => {
      const qid = findIDfromIndex(index);
      if (!qid) return;
      const newQState = history[qid] ?? defaultState;
      setQState(newQState);
      setCurrIdx(newQState.index);
    },
    [questions, answers, history, getAccumulated]
  );

  // Handle navigation to next question
  const handleNext = useCallback(() => {
    const cur = qState.question;
    if (!cur) return;
    submitIfChanged(cur);
    goTo(qState.index + 1);
  }, [questions, qState.index, submitIfChanged, goTo]);

  // Handle navigation to previous question
  const handlePrev = useCallback(() => {
    const cur = qState.question;
    if (!cur) return;
    submitIfChanged(cur);
    goTo(qState.index - 1);
  }, [questions, qState.index, submitIfChanged, goTo]);

  // Handle end of session
  const handleEnd = useCallback(() => {
    const cur = qState.question;
    if (!cur) return;
    submitIfChanged(cur, true);
    setDone(true);
  }, [
    questions,
    qState.index,
    submitIfChanged,
    submitMutation,
    sessionId,
    answers,
    getAccumulated,
  ]);

  // Effect to check if session is complete and navigate to results
  useEffect(() => {
    if (!questionsLeft.isSuccess) return;
    // const time: Record<string, number> = {};
    // Object.values(history).forEach((q) =>
    //   q.id
    //     ? (time[q.id] = Math.round(accumulatedRef.current[q.id] ?? 0))
    //     : null
    // );
    // const testResult = buildTestResults(
    //   history,
    //   answers,
    //   correctAnswers,
    //   explanations,
    //   time
    // );
    const keys = Object.keys(history);
    const allSubmitted =
      keys.length >= 1 && keys.every((k) => history[k]?.submitted === true);
    if ((mode === 'test' && !done) || !allSubmitted) return;

    const times: Record<string, number> = {};
    Object.values(history).forEach((q) =>
      q.id
        ? (times[q.id] = Math.round(accumulatedRef.current[q.id] ?? 0))
        : null
    );

    const testResults = buildTestResults(
      history,
      answers,
      correctAnswers,
      explanations,
      times
    );
    const totalTimeSec = Object.values(times).reduce((a, b) => a + b, 0) / 1000;
    const formatted = new Date(totalTimeSec * 1000).toISOString().substr(11, 8);

    setTestResult(testResults);
    setTotalTime(formatted);

    sessionStorage.setItem('testResults', JSON.stringify(testResults));
    sessionStorage.setItem('totalTime', formatted);
    router.push(CLIENT.RESULT());
  }, [
    history,
    questions,
    answers,
    correctAnswers,
    explanations,
    accumulatedRef,
    router,
    sessionId,
    questionsLeft.isSuccess,
  ]);

  if (questionsLeft.isLoading || !questions.length || !current)
    return <Loading />;

  const progress = ((qState.index + 1) / questions.length) * 100;

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col z-5 w-screen fixed inset-0'>
      <header className='bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-1 sm:px-6 py-6'>
        <div className='max-w-7xl mx-auto flex flex-col'>
          <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 mb-1'>
            <div className='flex-1'>
              <Progress value={progress} className='h-1' />
              <p className='text-sm text-muted-foreground mt-1'>
                Question {qState.index + 1} of {questions.length}
              </p>
            </div>
            <div className='text-center sm:text-right'>
              <p className='font-semibold text-foreground capitalize'>
                {capitaliseWords(mode)} Mode
              </p>
            </div>
          </div>

<div className='flex items-center justify-between'>
          <div>
            {Object.values(history).map((qState) => {
              // type Key = keyof QuizQuestion;
              return (
                <button
                  className='group relative inline-block m-1 p-2 border rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center flex-wrap'
                  key={qState.id}
                  onClick={() => goTo(qState.index)}
                >
                  <p
                    className={`${
                      !!qState.submitted ? 'text-[#6BCB77]' : 'text-[#FF6B6B]'
                    } font-bold text-base p-1 flex justify-center items-center aspect-square w-4 h-4`}
                  >
                    {qState.index + 1}
                  </p>
                  <div className='absolute left-0 rounded opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity flex flex-col gap-1 border-0.5 p-5 bg-[#a3d5ff] w-100 z-5'>
                    <div className='flex flex-col items-start text-justify'>
                      <p className='text-sm mb-2 line-clamp-3'>
                        <span className='font-bold'>Question:</span>{' '}
                        {qState.question?.question_text}
                      </p>

                      <p className='text-sm mb-2'>
                        <span className='font-bold'>Option Picked: </span>
                        {qState.selected ? (
                          qState.question?.options.find(
                            (o) => o.id === answers[qState.id as string]
                          )?.option_text
                        ) : (
                          <span className='text-gray-500'>Not Answered</span>
                        )}
                      </p>

                      {/* Time Spent */}
                      <p className='text-sm'>
                        <span className='font-bold'>Time Spent:</span>{' '}
                        {(
                          (qState.question?.time_to_answer_ms as number) / 1000
                        ).toFixed(1)}{' '}
                        seconds
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
            <div className='ml-auto'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  handleEnd();
                  router.push(CLIENT.STUDY);
                }}
                className='text-muted-foreground hover:text-foreground'
              >
                <X size={18} />
                <span className='ml-2'>End Session</span>
              </Button>
            </div></div>

          <div>
            {mode === 'test' && (
              <div className='flex items-center gap-2 text-foreground'>
                <Clock size={20} />
                <CountdownTimer
                  initialSeconds={seconds as number}
                  onComplete={handleEnd}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className='flex-1 overflow-auto px-4 sm:px-6 py-6'>
        <div className='max-w-2xl lg:max-w-4/5 mx-auto'>
          <Card className='mb-3 shadow-sm'>
            <CardContent className='pt-2'>
              <h2 className='text-lg font-semibold text-foreground mb-3'>
                {current.question_text}
              </h2>

              <RadioGroup
                value={answers[current.id] ?? ''}
                onValueChange={(v) => handleSelect(current.id, v)}
                disabled={!!qState.showExplanation}
              >
                <div className='space-y-3 grid lg:grid-cols-2 grid-cols-1 gap-x-3'>
                  {current.options.map((option) => (
                    <div
                      key={option.id}
                      className='flex items-center space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer'
                      onClick={() =>
                        !qState.showExplanation &&
                        handleSelect(current.id, option.id)
                      }
                    >
                      <RadioGroupItem
                        value={option.id}
                        id={option.id}
                        disabled={!!qState.showExplanation}
                      />
                      <Label
                        htmlFor={option.id}
                        className='flex-1 cursor-pointer text-foreground'
                      >
                        {option.option_text}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {qState.showHint && mode === 'tutor' && (
            <div className='p-2 my-4 border w-full rounded-10 shadow-sm text-sm'>
              <p>{current.hint}</p>
            </div>
          )}

          {mode !== 'test' &&
            qState.showExplanation &&
            correctAnswers[current.id] && (
              <QuizFeedback
                isCorrect={answers[current.id] === correctAnswers[current.id]}
                explanation={explanations[current.id] as string}
                userAnswer={
                  current.options.find((o) => o.id === answers[current.id])
                    ?.option_text ?? ''
                }
                correctAnswer={
                  current.options.find(
                    (o) => o.id === correctAnswers[current.id]
                  )?.option_text ?? ''
                }
              />
            )}

          <div className='flex gap-3 flex-col sm:flex-row'>
            {mode !== 'test' && !qState.showExplanation ? (
              <>
                <Button
                  onClick={() => checkMutation.mutate(current.id)}
                  disabled={
                    qState.selected == null ||
                    checkMutation.status === 'pending'
                  }
                  size='lg'
                  className='flex-1'
                >
                  Check Answer
                </Button>
                {mode === 'tutor' && (
                  <Button
                    variant='outline'
                    size='lg'
                    className='flex-1 sm:flex-none bg-transparent'
                    onClick={() => updateQuizState({ showHint: true })}
                  >
                    <Lightbulb size={18} />
                    <span className='ml-2'>Hint</span>
                  </Button>
                )}
              </>
            ) : qState.showRating &&
              mode !== 'test' &&
              current.type === 'review' &&
              correctAnswers[current.id] === answers[current.id] ? (
              <div className='w-full space-y-3'>
                <p className='text-sm font-medium text-foreground text-center'>
                  How well did you recall this?
                </p>
                <div className='grid grid-cols-4 gap-2'>
                  {ratingTypes.map((label) => (
                    <Button
                      key={label}
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        setRatings((p) => ({
                          ...p,
                          [current.id]: label,
                        }));
                        updateQuizState({ showRating: false });
                      }}
                      className='w-full'
                    >
                      {capitaliseWords(label as string)}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className='flex flex-row items-center gap-2 w-full justify-around'>
                <Button
                  onClick={handlePrev}
                  size='lg'
                  disabled={
                    qState.index <= 0 || submitMutation.status === 'pending'
                  }
                >
                  <ChevronLeft />
                  <span>Prev Question</span>
                </Button>
                {qState.index >= questions.length - 1 ? (
                  <Button
                    onClick={() => {
                      handleEnd();
                    }}
                    disabled={
                      (mode !== 'test' &&
                        (!questions.length ||
                          Object.keys(history).length !== questions.length) &&
                        Object.keys(history).every(
                          (k) => history[k]?.submitted === true
                        )) ||
                      submitMutation.status === 'pending'
                    }
                    size='lg'
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    size='lg'
                    disabled={submitMutation.status === 'pending'}
                  >
                    <span>Next Question</span>
                    <ChevronRight />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
