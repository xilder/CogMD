"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Bell, Upload, CheckCircle } from "lucide-react"

interface QuickAction {
  id: number
  title: string
  icon: React.ReactNode
  onClick: () => void
}

export function QuickActions() {
  const quickActions: QuickAction[] = [
    {
      id: 1,
      title: "Add Live Session",
      icon: <Plus className="w-5 h-5" />,
      onClick: () => console.log("Add Live Session clicked"),
    },
    {
      id: 2,
      title: "Send Announcement",
      icon: <Bell className="w-5 h-5" />,
      onClick: () => console.log("Send Announcement clicked"),
    },
    {
      id: 3,
      title: "Upload Content",
      icon: <Upload className="w-5 h-5" />,
      onClick: () => console.log("Upload Content clicked"),
    },
    {
      id: 4,
      title: "Approve Certificate",
      icon: <CheckCircle className="w-5 h-5" />,
      onClick: () => console.log("Approve Certificate clicked"),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action: QuickAction) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-purple-200 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mb-2 group-hover:bg-purple-200 transition-colors">
                <div className="text-purple-600">{action.icon}</div>
              </div>
              <span className="text-xs text-gray-700 text-center leading-tight">{action.title}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
