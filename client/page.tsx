import { StatsCards } from "@/components/admin/dashboard/stats-cards"
import { PlatformEngagement } from "@/components/admin/dashboard/platform-engagement"
import { ModuleCompletion } from "@/components/admin/dashboard/module-completion"
import { WeekHighlights } from "@/components/admin/dashboard/week-highlights"
import { CertificateRequests } from "@/components/admin/dashboard/certificate-requests"
import { WeeklyModuleCompletion } from "@/components/admin/dashboard/weekly-module-completion"
import { AverageCourseProgress } from "@/components/@/components/admin/dashboard/average-course-progress"
import { TasksList } from "@/components/admin/dashboard/tasks-list"
import { QuickActions } from "@/components/admin/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto w-full space-y-4 sm:space-y-6">
        <DashboardHeader />
        <StatsCards />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-1">
            <PlatformEngagement />
          </div>
          <div className="lg:col-span-1">
            <ModuleCompletion />
          </div>
          <div className="lg:col-span-1">
            <WeekHighlights />
          </div>
        </div>

        <CertificateRequests />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <WeeklyModuleCompletion />
          </div>
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <AverageCourseProgress />
            <TasksList />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  )
}
