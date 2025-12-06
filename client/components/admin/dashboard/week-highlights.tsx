import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Megaphone, Award, Activity } from "lucide-react"

const highlights = [
  {
    icon: Calendar,
    title: "Next Live Session",
    description: "Week 6: Academic Writing & Ref...",
    time: "Saturday, Sept 7, 9:00am",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  {
    icon: Megaphone,
    title: "Admin Announcement",
    description: "New tutor assigned",
    time: "",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  {
    icon: Award,
    title: "Upcoming Certificate Approval",
    description: "3 requests due for review",
    time: "",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    icon: Activity,
    title: "Recent Student Activity",
    description: "Ada completed Week 4 module",
    time: "",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    icon: Activity,
    title: "Recent Student Activity",
    description: "Ada completed in Week 6 module",
    time: "",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
]

export function WeekHighlights() {
  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">This Week's Highlights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={`p-1.5 rounded ${highlight.bgColor} mt-0.5`}>
                <highlight.icon className={`h-3 w-3 ${highlight.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{highlight.title}</p>
                <p className="text-xs text-gray-600 truncate">{highlight.description}</p>
                {highlight.time && <p className="text-xs text-gray-500 mt-1">{highlight.time}</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
