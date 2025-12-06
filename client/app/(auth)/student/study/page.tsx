'use client';

import Loading from '@/app/loading';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useModalInfo } from '@/context/info-modal';
import { CLIENT } from '@/lib/routes';
import { capitaliseWords } from '@/lib/utils';
import {
  getActiveSession,
  getTags,
  startMixedSession,
  startNewSession,
  startReviewSession,
} from '@/services/api';
import { NewSessionRequest } from '@/types/schemas';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useQuestionContext } from '../layout';

export default function StudyPage() {
  const { setInfo } = useModalInfo();
  const { setSessionIdFn } = useQuestionContext();
  const getSpecialtyFromId = (id: string) =>
    specialtyList?.filter((specialty) => specialty.id === id)[0].name;
  const getAllTags = useQuery({
    queryKey: ['quiz', 'tags'],
    queryFn: () => getTags(),
  });

  const activeSession = useQuery({
    queryKey: ['quiz', 'session', 'active'],
    queryFn: getActiveSession,
  });

  const setQuiz = () => {
    if (activeSession.data)
      router.push(
        CLIENT.SESSION(activeSession.data.id, activeSession.data.session_type)
      );
    else router.push(CLIENT.STUDY);
  };

  const getSession = useMutation({
    mutationFn: ({
      tag_id,
      limit,
      type,
    }: NewSessionRequest & { type: 'test' | 'review' | 'tutor' }) => {
      if (type === 'test') return startNewSession({ tag_id, limit });
      else if (type === 'review') return startReviewSession({ tag_id, limit });
      else return startMixedSession({ tag_id, limit });
    },
    mutationKey: ['quiz', 'type'],
    onSuccess: (data, variables) => {
      if (!data.session_id) {
        setInfo(
          'info',
          variables.type === 'test'
            ? `No more new questions ${
                variables.tag_id
                  ? `for ${getSpecialtyFromId(variables.tag_id)}`
                  : ''
              }.`
            : `Not enough review questions for ${getSpecialtyFromId(
                variables.tag_id as string
              )}`
        );
        // const timer = setTimeout(() => router.replace(CLIENT.STUDY), 10000)
      } else {
        setSessionIdFn(data.session_id);
        // router.push(CLIENT.SESSION(data.session_id, variables.type));
      }
    },
    onError: (_, variables) =>
      setInfo(
        'info',
        variables.type === 'test'
          ? `No more new questions ${
              variables.tag_id
                ? `for ${getSpecialtyFromId(variables.tag_id)}`
                : ''
            }. Please try reviewing other questions or try another specialties.`
          : `Not enough review questions for ${getSpecialtyFromId(
              variables.tag_id as string
            )}. Please try answering more new questions.`
      ),
  });

  useEffect(() => {
    if (getSession.data?.session_id)
      router.push(CLIENT.SESSION(getSession.data?.session_id));
  }, [getSession.isSuccess]);

  const specialtyList = getAllTags.data;
  const router = useRouter();

  if (activeSession.isLoading) return <Loading />;
  return (
    <main className='flex-1 overflow-auto'>
      <div className='p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'>
        <h1 className='text-3xl font-bold text-foreground mb-2'>
          Study Materials
        </h1>
        <p className='text-muted-foreground mb-8'>
          Select a topic to begin studying
        </p>

        {activeSession.data ? (
          <div className='w-full h-full flex justify-center mt-5'>
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
          </div>
        ) : getAllTags.status === 'pending' ? (
          <div className='h-full w-full'>
            <Loading />
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {specialtyList?.map((topic) => (
              <Card
                key={topic.name}
                className='hover:shadow-md transition-shadow cursor-pointer'
              >
                <CardHeader>
                  <CardTitle>{capitaliseWords(topic.name)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <Button
                      variant='outline'
                      className='w-full bg-transparent'
                      disabled={getSession.isPending}
                      onClick={() => {
                        getSession.mutate({
                          tag_id: topic.id,
                          limit: 10,
                          type: 'review',
                        });
                        router.push(
                          CLIENT.SESSION(
                            getSession.data?.session_id as string,
                            'review'
                          )
                        );
                      }}
                    >
                      Review Mode
                    </Button>
                    <Button
                      variant='outline'
                      className='w-full bg-transparent'
                      disabled={getSession.isPending}
                      onClick={() => {
                        getSession.mutate({
                          tag_id: topic.id,
                          limit: 10,
                          type: 'test',
                        });
                        router.push(
                          CLIENT.SESSION(
                            getSession.data?.session_id as string,
                            'test'
                          )
                        );
                      }}
                    >
                      Test Mode
                    </Button>
                    <Button
                      className='w-full'
                      disabled={getSession.isPending}
                      onClick={() => {
                        getSession.mutate({
                          tag_id: topic.id,
                          limit: 10,
                          type: 'tutor',
                        });
                        router.push(
                          CLIENT.SESSION(
                            getSession.data?.session_id as string,
                            'tutor'
                          )
                        );
                      }}
                    >
                      Tutor Mode
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
