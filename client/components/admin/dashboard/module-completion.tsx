import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ModuleCompletion() {
  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Module Completion Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="relative w-40 h-40">
            {/* Donut Chart SVG */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f3e8ff" strokeWidth="8" />
              {/* Completed section (60%) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="8"
                strokeDasharray={`${60 * 2.51} ${40 * 2.51}`}
                strokeLinecap="round"
              />
              {/* In Progress section (30%) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#c084fc"
                strokeWidth="8"
                strokeDasharray={`${30 * 2.51} ${70 * 2.51}`}
                strokeDashoffset={`-${60 * 2.51}`}
                strokeLinecap="round"
              />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm text-gray-600">Avg. Progress:</span>
              <span className="text-xl font-bold text-gray-900">75%</span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <span className="text-sm font-semibold">60%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-300 rounded-full"></div>
              <span className="text-sm text-gray-600">In Progress</span>
            </div>
            <span className="text-sm font-semibold">30%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
              <span className="text-sm text-gray-600">Not Started</span>
            </div>
            <span className="text-sm font-semibold">10%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
