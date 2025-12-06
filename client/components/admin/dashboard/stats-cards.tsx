import { Card, CardContent } from "@/components/ui/card"
import { Users, BookOpen, TrendingUp, Award, UserPlus } from "lucide-react"

const stats = [
  {
    title: "Total Enrolled Students",
    value: "1,284",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Active Courses",
    value: "1",
    icon: BookOpen,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  {
    title: "Revenue This Month",
    value: "₦1,240,000",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Certificate Requests",
    value: "5",
    icon: Award,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Today's New Signups",
    value: "23",
    icon: UserPlus,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white border-gray-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">{stat.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
