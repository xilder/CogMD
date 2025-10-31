"use client"
import DashboardHeader from '@/components/dashboard-header';
import Sidebar from '@/components/sidebar';
import { useState } from 'react';

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className='flex h-screen bg-background'>
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className='flex-1 flex flex-col overflow-hidden'>
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div>{children}</div>
      </div>
    </div>
  );
};
