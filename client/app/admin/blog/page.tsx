"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"

const mockBlogPosts = [
  {
    id: 1,
    title: "Beyond Rote Memorization: How to Actually Retain Information for the PLAB Exam",
    author: "Dr. Sarah Chen",
    status: "Published",
    publishedDate: "2024-01-15",
  },
  {
    id: 2,
    title: "The Hidden Curriculum: Mastering Ethics and Communication for the PLAB",
    author: "Dr. James Wilson",
    status: "Published",
    publishedDate: "2024-01-10",
  },
  {
    id: 3,
    title: "Managing PLAB Prep Burnout: A Practical Guide for Busy Doctors",
    author: "Dr. Priya Patel",
    status: "Draft",
    publishedDate: null,
  },
]

export default function BlogManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
        <Link href="/admin/blog/editor">
          <Button>
            <Plus size={20} className="mr-2" />
            Create New Post
          </Button>
        </Link>
      </div>

      {/* Blog Posts Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockBlogPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="max-w-xs truncate">{post.title}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      post.status === "Published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {post.status}
                  </span>
                </TableCell>
                <TableCell>{post.publishedDate || "-"}</TableCell>
                <TableCell>
                  <Link href={`/admin/blog/editor?id=${post.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
