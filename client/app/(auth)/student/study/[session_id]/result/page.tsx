'use client';

import Loading from '@/app/loading';
import QuizFeedback from '@/components/quiz-feedback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CLIENT } from '@/lib/routes';
import { CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface TestResult {
  questionId: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

// Mock results data
const mockResults: TestResult[] = [
  {
    questionId: 'q1',
    questionText: 'A 45-year-old male presents with chest pain...',
    userAnswer: 'Inferior wall MI',
    correctAnswer: 'Inferior wall MI',
    isCorrect: true,
    explanation:
      'Correct! ST elevation in II, III, aVF indicates inferior wall MI.',
  },
  {
    questionId: 'q2',
    questionText: 'Which of the following is the most common cause...',
    userAnswer: 'Medications',
    correctAnswer: 'Prerenal hypoperfusion',
    isCorrect: false,
    explanation:
      'Prerenal hypoperfusion is the most common cause of AKI in hospitalized patients.',
  },
];

export default function ResultsPage({
  params,
}: {
  params: { session_id: string };
}) {
  const router = useRouter();
  const [selectedQuestion, setSelectedQuestion] = useState<TestResult | null>(
    null
  );
  const [testResult, setTestResult] = useState<TestResult[]>([]);
  const [totalTime, setTotalTime] = useState<string>('00:00');

  const [correctCount, setCorrectCount] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    const results = sessionStorage.getItem('testResults');
    const time = sessionStorage.getItem('totalTime');
    if (results) {
      setTestResult(JSON.parse(results));
    }
    if (time) setTotalTime(time);
  }, []);

  useEffect(() => {
    setCorrectCount(testResult.filter((r) => r.isCorrect).length);
    setAccuracy(Math.round((correctCount / testResult.length) * 100));
  }, [testResult, correctCount]);

  if (testResult.length === 0) return <Loading />;

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 py-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-foreground mb-2'>
            Test Results
          </h1>
          <p className='text-muted-foreground'>Review your performance below</p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Final Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-foreground'>
                {correctCount}/{testResult.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-foreground'>
                {accuracy}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Total Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-foreground'>
                {totalTime}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Review */}
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-foreground mb-4'>
            Question Review
          </h2>
          <ScrollArea className='border border-slate-200 dark:border-slate-800 rounded-lg'>
            <div className='p-4 space-y-2'>
              {testResult.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedQuestion(result)}
                  className='w-full flex items-center gap-3 p-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-left border border-slate-200 dark:border-slate-800'
                >
                  {result.isCorrect ? (
                    <CheckCircle
                      size={24}
                      className='text-green-500 flex-shrink-0'
                    />
                  ) : (
                    <XCircle size={24} className='text-red-500 flex-shrink-0' />
                  )}
                  <span className='text-foreground truncate flex-1'>
                    {result.questionText.substring(0, 60)}...
                  </span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3 justify-center flex-col sm:flex-row'>
          <Button
            variant='outline'
            onClick={() => router.push(CLIENT.STUDY)}
            className='flex-1 sm:flex-none'
          >
            Back to Study
          </Button>
          <Button
            onClick={() => router.push(CLIENT.STUDY)}
            className='flex-1 sm:flex-none'
          >
            Take Another Test
          </Button>
        </div>

        {/* Question Detail Modal */}
        <Dialog
          open={!!selectedQuestion}
          onOpenChange={() => setSelectedQuestion(null)}
        >
          <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
            {selectedQuestion && (
              <>
                <DialogHeader>
                  <DialogTitle>Question Review</DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                  <div>
                    <h3 className='font-semibold text-foreground mb-2'>
                      {selectedQuestion.questionText}
                    </h3>
                  </div>

                  <div className='space-y-2'>
                    <div>
                      <p className='text-sm text-muted-foreground'>
                        Your answer:
                      </p>
                      <p className='font-medium text-foreground'>
                        {selectedQuestion.userAnswer}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>
                        Correct answer:
                      </p>
                      <p className='font-medium text-foreground'>
                        {selectedQuestion.correctAnswer}
                      </p>
                    </div>
                  </div>

                  <QuizFeedback
                    isCorrect={selectedQuestion.isCorrect}
                    explanation={selectedQuestion.explanation}
                    userAnswer={selectedQuestion.userAnswer}
                    correctAnswer={selectedQuestion.correctAnswer}
                  />
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
