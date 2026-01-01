'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DashboardStatsResponse } from '@/types/schemas';
import WeeklyProgressChart from './weekly-progress-chart';

export default function ProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Progress</CardTitle>
        <CardDescription>Your performance over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {/* <ResponsiveContainer width='100%' height={300}>
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
        </ResponsiveContainer> */}
        <WeeklyProgressChart />
      </CardContent>
    </Card>
  );
}
