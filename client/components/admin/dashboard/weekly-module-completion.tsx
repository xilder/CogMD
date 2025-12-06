import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ModuleData {
  week: string
  moduleTitle: string
  completionRate: string
}

export function WeeklyModuleCompletion() {
  const moduleData: ModuleData[] = [
    {
      week: "Week 1",
      moduleTitle: "Introduction to Research",
      completionRate: "78%",
    },
    {
      week: "Week 2",
      moduleTitle: "Research Design Fundamentals",
      completionRate: "56%",
    },
    {
      week: "Week 3",
      moduleTitle: "Literature Review & Knowledge Management",
      completionRate: "40%",
    },
    {
      week: "Week 4",
      moduleTitle: "AI & Digital Tools for Research",
      completionRate: "0%",
    },
    {
      week: "Week 5",
      moduleTitle: "Data Collection Methods",
      completionRate: "0%",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Weekly Module Completion</CardTitle>
        <button className="text-sm text-purple-600 hover:text-purple-700">View all</button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Week</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Module Title</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Avg. Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {moduleData.map((module: ModuleData, index: number) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-2 text-sm text-gray-900">{module.week}</td>
                  <td className="py-3 px-2 text-sm text-gray-900">{module.moduleTitle}</td>
                  <td className="py-3 px-2 text-sm text-gray-900 text-right">{module.completionRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
