"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Menu, X, BarChart3, HelpCircle, Newspaper, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navItems = [
    { icon: BarChart3, label: "Dashboard", href: "/admin" },
    { icon: HelpCircle, label: "Question Bank", href: "/admin/questions" },
    { icon: Newspaper, label: "Blog Posts", href: "/admin/blog" },
    { icon: Users, label: "User Management", href: "/admin/users" },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-slate-800 text-white transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">CognitoMD</h1>
          <p className="text-sm text-slate-400">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer">
                <item.icon size={20} />
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <Button variant="outline" className="w-full text-slate-800 bg-transparent">
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
          <h2 className="text-lg font-semibold text-foreground">Admin Dashboard</h2>
          <div className="w-10 h-10 rounded-full bg-primary/10" />
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
