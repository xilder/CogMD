import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Task {
  id: number
  title: string
  status: "Pending" | "Due Today" | "Incomplete" | "Upcoming" | "Urgent"
  icon: string
}

export function TasksList() {
  const tasks: Task[] = [
    {
      id: 1,
      title: "Review 5 new certificate requests",
      status: "Pending",
      icon: "📋",
    },
    {
      id: 2,
      title: "Send reminder email to Week 3 students",
      status: "Due Today",
      icon: "📧",
    },
    {
      id: 3,
      title: "Upload Week 8 tutorial video",
      status: "Incomplete",
      icon: "📹",
    },
    {
      id: 4,
      title: "Invite tutor for Module 8 live session",
      status: "Upcoming",
      icon: "👥",
    },
    {
      id: 5,
      title: "Resolve quiz access issue reported by 3 students",
      status: "Urgent",
      icon: "⚠️",
    },
  ]

  const getStatusColor = (status: Task["status"]): string => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Due Today":
        return "bg-red-100 text-red-800"
      case "Incomplete":
        return "bg-gray-100 text-gray-800"
      case "Upcoming":
        return "bg-green-100 text-green-800"
      case "Urgent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task: Task) => (
            <div key={task.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
              <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">{task.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 leading-relaxed">{task.title}</p>
                <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
