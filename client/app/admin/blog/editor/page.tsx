"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"

export default function BlogEditorPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [status, setStatus] = useState("draft")
  const [author, setAuthor] = useState("")

  const handleSave = () => {
    console.log("[v0] Saving blog post:", { title, content, status, author })
    // Save logic would go here
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/blog">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft size={20} className="mr-2" />
          Back to Blog Posts
        </Button>
      </Link>

      <h1 className="text-3xl font-bold text-foreground">Blog Post Editor</h1>

      <Card className="p-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-foreground">Blog Post Title</label>
          <Input
            placeholder="Enter blog post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Author</label>
          <Input
            placeholder="Enter author name..."
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Content (Markdown)</label>
          <Textarea
            placeholder="Write your blog post content here... (Markdown supported)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-2 min-h-96 font-mono text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Status</label>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-2">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} className="flex-1">
            Save Post
          </Button>
          <Link href="/admin/blog" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              Cancel
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
