import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CourseProgress {
  courseName: string
  progress: number
}

export function AverageCourseProgress() {
  const courseProgress: CourseProgress = {
    courseName: "Research Technologies and Innovation",
    progress: 25,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Average Course Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm text-gray-600">{courseProgress.courseName}</div>
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${courseProgress.progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900">{courseProgress.progress}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
