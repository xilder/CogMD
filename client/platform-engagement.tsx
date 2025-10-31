import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { week: "Week 1", signups: 25, enrollments: 0 },
  { week: "Week 2", signups: 55, enrollments: 0 },
  { week: "Week 3", signups: 50, enrollments: 0 },
  { week: "Week 4", signups: 40, enrollments: 0 },
]

export function PlatformEngagement() {
  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900">Platform Engagement Overview</CardTitle>
        <select
          defaultValue="this-month"
          className="w-32 px-3 py-1 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="this-month">This Month</option>
          <option value="last-month">Last Month</option>
        </select>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>

          <div className="flex items-end justify-between h-40 gap-4">
            {chartData.map((data, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full bg-gray-100 rounded-t flex flex-col justify-end h-32">
                  <div
                    className="bg-purple-600 rounded-t w-full"
                    style={{ height: `${(data.signups / 60) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">{data.week}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded"></div>
              <span>Signups</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded"></div>
              <span>Enrollments</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
