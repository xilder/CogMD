import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, BookOpen, Target, Zap } from "lucide-react"

const kpis = [
  {
    icon: TrendingUp,
    label: "Overall Progress",
    value: "68%",
    change: "+5% this week",
  },
  {
    icon: BookOpen,
    label: "Questions Answered",
    value: "342",
    change: "+28 today",
  },
  {
    icon: Target,
    label: "Accuracy Rate",
    value: "76%",
    change: "+2% this week",
  },
  {
    icon: Zap,
    label: "Study Streak",
    value: "12 days",
    change: "Keep it up!",
  },
]

export default function KPICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.change}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
