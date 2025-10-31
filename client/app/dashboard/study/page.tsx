'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function StudyPage() {
  return (
    <>
      <main className='flex-1 overflow-auto'>
        <div className='p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'>
          <h1 className='text-3xl font-bold text-foreground mb-2'>
            Study Materials
          </h1>
          <p className='text-muted-foreground mb-8'>
            Select a topic to begin studying
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[
              { title: 'Cardiology', questions: 45 },
              { title: 'Respiratory', questions: 38 },
              { title: 'Gastroenterology', questions: 52 },
              { title: 'Neurology', questions: 41 },
              { title: 'Endocrinology', questions: 35 },
              { title: 'Rheumatology', questions: 28 },
            ].map((topic) => (
              <Card
                key={topic.title}
                className='hover:shadow-md transition-shadow cursor-pointer'
              >
                <CardHeader>
                  <CardTitle>{topic.title}</CardTitle>
                  <CardDescription>{topic.questions} questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className='w-full'>Start Studying</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
