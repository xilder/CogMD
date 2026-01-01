import { useQuestionContext } from '@/app/(auth)/student/layout';
import Loading from '@/app/loading';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CLIENT } from '@/lib/routes';
import { getActiveSession, startNewSession } from '@/services/api';
import { NewSessionRequest } from '@/types/schemas';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BookOpen, CheckCircle, Lightbulb } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import StatusScreen from './status-screen';

export default function ActionCards() {
  const router = useRouter();
  // const { setInfo } = useModalInfo();
  const [statusConfig, setStatusConfig] = useState<React.ComponentProps<
    typeof StatusScreen
  > | null>(null);
  const { setSessionIdFn } = useQuestionContext();
  const activeSession = useQuery({
    queryKey: ['quiz', 'session', 'active'],
    queryFn: getActiveSession,
  });
  const setQuiz = () => {
    if (activeSession.data) {
      setSessionIdFn(activeSession.data.id);
      router.push(CLIENT.SESSION(activeSession.data.session_type));
    } else router.push(CLIENT.STUDY);
  };
  const getSession = useMutation({
    mutationFn: ({
      tag_id,
      limit,
      type,
    }: NewSessionRequest & { type: 'test' | 'review' | 'tutor' }) => {
      return startNewSession({ tag_id, limit });
    },
    mutationKey: ['quiz', 'type'],
    onSuccess: (data, variables) => {
      if (!data.session_id) {
        setStatusConfig({
          variant: 'success',
          icon: CheckCircle,
          title: 'All Caught Up!',
          message: `Congratulations! You've completed all the new questions. You can now review your knowledge or pick a different specialty.`,
          actions: [
            {
              label: 'Review Other Topics',
              onClick: () => {
                setStatusConfig(null);
                getSession.mutate({ ...variables, type: 'review' });
              },
              variant: 'default',
            },
            {
              label: 'Choose New Topic',
              onClick: () => router.push(CLIENT.STUDY),
              variant: 'outline',
            },
          ],
        });
      } else {
        setSessionIdFn(data.session_id);
        router.push(CLIENT.SESSION(variables.type));
      }
    },
  });
  if (activeSession.isLoading) return <Loading />;
  if (statusConfig) {
    return <StatusScreen {...statusConfig} />;
  }
  return (
    <div className='space-y-4'>
      <Card className='hover:shadow-md transition-shadow'>
        <CardHeader>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center'>
              <BookOpen className='w-5 h-5 text-primary' />
            </div>
            <CardTitle className='text-lg'>Start Review</CardTitle>
          </div>
          <CardDescription>
            Continue your daily practice questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className='w-full' onClick={setQuiz}>
            {activeSession.data ? 'Resume Last Session' : 'Start Now'}
          </Button>
        </CardContent>
      </Card>

      <Card className='hover:shadow-md transition-shadow'>
        <CardHeader>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center'>
              <Lightbulb className='w-5 h-5 text-primary' />
            </div>
            <CardTitle className='text-lg'>Learn New Topic</CardTitle>
          </div>
          <CardDescription>
            Explore new study materials and concepts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant='outline'
            className='w-full bg-transparent'
            disabled={!!activeSession.data}
            onClick={() => getSession.mutate({ type: 'test', limit: 10 })}
          >
            Explore
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
