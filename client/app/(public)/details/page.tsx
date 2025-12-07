'use client';
import { useState } from 'react';

export default function DashboardPage() {
  const [menu, setMenu] = useState(false);
  const onMenuClick = () => setMenu((prev) => !prev);
  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-6'>
      {/* <div className='mx-auto w-full space-y-4 sm:space-y-6'>
        <DashboardHeader onMenuClick={onMenuClick} />
        <StatsCards />

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
          <div className='lg:col-span-1'>
            <PlatformEngagement />
          </div>
          <div className='lg:col-span-1'>
            <ModuleCompletion />
          </div>
          <div className='lg:col-span-1'>
            <WeekHighlights />
          </div>
        </div>

        <CertificateRequests />

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>
          <div className='lg:col-span-2'>
            <WeeklyModuleCompletion />
          </div>
          <div className='lg:col-span-1 space-y-4 sm:space-y-6'>
            <AverageCourseProgress />
            <TasksList />
            <QuickActions />
          </div>
        </div>
      </div> */}
    </div>
  );
}
