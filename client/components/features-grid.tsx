import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, BarChart3, Clock, Users, Zap } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Cognitive Science",
    description: "Evidence-based learning techniques optimized for medical knowledge retention",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Content",
    description: "Complete PLAB exam coverage with detailed explanations and clinical context",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Real-time analytics to monitor your learning journey and identify weak areas",
  },
  {
    icon: Clock,
    title: "Flexible Learning",
    description: "Study at your own pace with bite-sized lessons and practice questions",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with fellow medical graduates and share learning experiences",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Get immediate explanations and learn from every question you attempt",
  },
]

export default function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => {
        const Icon = feature.icon
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
