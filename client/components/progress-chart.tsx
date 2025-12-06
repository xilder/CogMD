'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DashboardStatsResponse } from '@/types/schemas';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const mockData = [
  { day: 'Mon', correct: 12, incorrect: 3 },
  { day: 'Tue', correct: 15, incorrect: 2 },
  { day: 'Wed', correct: 10, incorrect: 4 },
  { day: 'Thu', correct: 18, incorrect: 1 },
  { day: 'Fri', correct: 14, incorrect: 3 },
  { day: 'Sat', correct: 16, incorrect: 2 },
  { day: 'Sun', correct: 13, incorrect: 2 },
];

export default function ProgressChart({
  weeklyInfo,
}: {
  weeklyInfo: DashboardStatsResponse['weeklyProgress'] | undefined;
}) {
  const data = weeklyInfo || mockData
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Progress</CardTitle>
        <CardDescription>Your performance over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray='3 3' stroke='var(--color-border)' />
            <XAxis dataKey='day' stroke='var(--color-muted-foreground)' />
            <YAxis stroke='var(--color-muted-foreground)' />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
              }}
            />
            <Legend />
            <Bar dataKey='correct' fill='var(--color-primary)' name='Correct' />
            <Bar
              dataKey='incorrect'
              fill='var(--color-destructive)'
              name='Incorrect'
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
