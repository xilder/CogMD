"use client"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const mockActivityData = [
  { date: "Day 1", users: 120, active: 45 },
  { date: "Day 2", users: 150, active: 62 },
  { date: "Day 3", users: 180, active: 78 },
  { date: "Day 4", users: 220, active: 95 },
  { date: "Day 5", users: 280, active: 120 },
  { date: "Day 6", users: 320, active: 145 },
  { date: "Day 7", users: 380, active: 170 },
]

export default function AdminDashboard() {
  const kpis = [
    { label: "Total Users", value: "2,847", change: "+12%" },
    { label: "Daily Active Users", value: "1,203", change: "+8%" },
    { label: "Questions Answered Today", value: "5,432", change: "+23%" },
    { label: "Overall Accuracy %", value: "78.5%", change: "+2.3%" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-6">
            <p className="text-sm text-muted-foreground mb-2">{kpi.label}</p>
            <p className="text-3xl font-bold text-foreground mb-2">{kpi.value}</p>
            <p className="text-sm text-green-600">{kpi.change}</p>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">User Activity Over Last 30 Days</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockActivityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#005A9C" strokeWidth={2} />
            <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
