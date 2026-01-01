'use client';

import { useDashboard } from '@/app/(auth)/student/layout';
import ActionCards from '@/components/action-cards';
import KPICards from '@/components/kpi-cards';
import ProgressChart from '@/components/progress-chart';
import { useAuth } from '@/context/auth-context';

export default function DashboardPage() {
  const { stats } = useDashboard();
  const { user } = useAuth();

  return (
    <>
      <main className='flex-1 overflow-auto'>
        <div className='p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'>
          {/* Welcome Section */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-foreground mb-2'>
              {`Welcome back, Dr. ${user ? user.full_name : 'Ahmed Hassan'}`}
            </h1>
            <p className='text-muted-foreground'>
              You're making great progress. Keep up the momentum!
            </p>
          </div>

          {/* KPI Cards */}
          <div className='mb-8'>
            <KPICards items={stats} />
          </div>

          {/* Action Cards and Chart */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-1'>
              <ActionCards />
            </div>
            <div className='lg:col-span-2'>
              <ProgressChart />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
