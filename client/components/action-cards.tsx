import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Lightbulb } from "lucide-react"

export default function ActionCards() {
  return (
    <div className="space-y-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Start Review</CardTitle>
          </div>
          <CardDescription>Continue your daily practice questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/study">
            <Button className="w-full">Start Now</Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Learn New Topic</CardTitle>
          </div>
          <CardDescription>Explore new study materials and concepts</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/study">
            <Button variant="outline" className="w-full bg-transparent">
              Explore
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
