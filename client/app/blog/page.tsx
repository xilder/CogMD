import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

const blogPosts = [
  {
    id: 1,
    slug: "beyond-rote-memorization",
    title: "Beyond Rote Memorization: How to Actually Retain Information for the PLAB Exam",
    excerpt:
      "Learn how active recall and spaced repetition can transform your study approach and build lasting knowledge.",
    author: "Dr. Sarah Chen",
    publishedDate: "2024-01-15",
    image: "/study-notes.jpg",
  },
  {
    id: 2,
    slug: "hidden-curriculum",
    title: "The Hidden Curriculum: Mastering Ethics and Communication for the PLAB",
    excerpt: "Discover why soft skills like ethics and communication are just as important as clinical knowledge.",
    author: "Dr. James Wilson",
    publishedDate: "2024-01-10",
    image: "/medical-ethics.jpg",
  },
  {
    id: 3,
    slug: "managing-burnout",
    title: "Managing PLAB Prep Burnout: A Practical Guide for Busy Doctors",
    excerpt: "Practical strategies to maintain your well-being while preparing for the PLAB exam.",
    author: "Dr. Priya Patel",
    publishedDate: "2024-01-05",
    image: "/holistic-wellness.png",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">The CognitoMD Blog</h1>
            <p className="text-lg text-muted-foreground text-balance">
              Evidence-based strategies and insights for your PLAB journey.
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col h-full">
                    <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">{post.author}</span>
                      <ArrowRight size={16} className="text-primary" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
