'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDashboard } from '../layout';

const progressData = [
  { week: 'Week 1', accuracy: 65 },
  { week: 'Week 2', accuracy: 68 },
  { week: 'Week 3', accuracy: 71 },
  { week: 'Week 4', accuracy: 74 },
  { week: 'Week 5', accuracy: 76 },
  { week: 'Week 6', accuracy: 78 },
];

export default function ProgressPage() {
  const { stats } = useDashboard();
  const data =
    stats?.weeklyProgress.map((accuracy, index) => ({
      week: `Week ${index + 1}`,
      accuracy,
    })) || progressData;
  return (
    <>
      <main className='flex-1 overflow-auto'>
        <div className='p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'>
          <h1 className='text-3xl font-bold text-foreground mb-2'>
            Your Progress
          </h1>
          <p className='text-muted-foreground mb-8'>
            Track your learning journey over time
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Accuracy Trend</CardTitle>
              <CardDescription>
                Your accuracy improvement over the last 6 weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={300}>
                <LineChart data={data}>
                  <CartesianGrid
                    strokeDasharray='3 3'
                    stroke='var(--color-border)'
                  />
                  <XAxis
                    dataKey='week'
                    stroke='var(--color-muted-foreground)'
                  />
                  <YAxis stroke='var(--color-muted-foreground)' />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='accuracy'
                    stroke='var(--color-primary)'
                    name='Accuracy %'
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
