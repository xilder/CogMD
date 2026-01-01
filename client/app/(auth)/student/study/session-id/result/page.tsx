'use client';

import Loading from '@/app/loading';
import QuizFeedback from '@/components/quiz-feedback';
import StatusScreen from '@/components/status-screen';
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
import { getResult } from '@/services/api';
import { TestResult } from '@/types/schemas';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ResultsPage() {
  const router = useRouter();
  const sessionId = sessionStorage.getItem('sessionID') || '';
  const [selectedQuestion, setSelectedQuestion] = useState<TestResult | null>(
    null
  );
  // const [testResult, setTestResult] = useState<TestResult[]>([]);
  // const [totalTime, setTotalTime] = useState<string>('00:00');

  // const [correctCount, setCorrectCount] = useState(0);
  // const [accuracy, setAccuracy] = useState(0);
  // const { testResult, totalTime } = useQuestionContext();

  const results = useQuery({
    queryKey: ['quiz', 'session', 'result'],
    queryFn: () => getResult(sessionId),
  });

  if (results.isLoading) return <Loading />;
  const totalTimeMs =
    results.data?.reduce((a, b) => a + (b.timeToAnswerMs || 0), 0) || 0;
  const minutes = Math.floor(totalTimeMs / 60000);
  const seconds = Math.floor((totalTimeMs % 60000) / 1000);
  const totalTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
  const testResult = results.data || [];
  const correctCount = testResult.filter((r) => r.isCorrect).length;
  const accuracy = Math.round((correctCount / testResult.length) * 100);

  if (results.isError) {
    return (
      <StatusScreen
        message="We couldn't find any test data for this session. This usually happens if the session was interrupted or the page was refreshed."
        variant='error'
        actions={[
          {
            label: 'Back to Study',
            onClick: () => router.push(CLIENT.STUDY),
            variant: 'outline',
          },
        ]}
      />
    );
  }
  // useEffect(() => {
  //   const results = sessionStorage.getItem('testResults');
  //   const time = sessionStorage.getItem('totalTime');
  //   if (results) {
  //     setTestResult(JSON.parse(results));
  //   }
  //   if (time) setTotalTime(time);
  // }, []);

  // useEffect(() => {
  //   setCorrectCount(testResult.filter((r) => r.isCorrect).length);
  //   setAccuracy(Math.round((correctCount / testResult.length) * 100));
  // }, [testResult, correctCount]);

  // if (testResult.length === 0) return <Loading />;

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
                    explanation={selectedQuestion.explanation as string}
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
