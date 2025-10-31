import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Brain, Timer } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-background">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Our Mission: Smarter Medical Education for Everyone
            </h1>
            <h3 className="text-lg sm:text-xl text-muted-foreground text-balance">
              CognitoMD was founded on a simple principle: every aspiring doctor deserves access to the best learning
              tools, regardless of their financial situation. We're here to make PLAB preparation more effective,
              accessible, and evidence-based.
            </h3>
          </div>
        </section>

        {/* Why Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Built for the International Medical Graduate
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We understand the unique pressures of preparing for the PLAB exam while juggling a demanding schedule. Our
              platform is designed to maximize the efficiency of your study time, focusing on high-yield content and
              proven learning techniques. Whether you're balancing clinical work, family responsibilities, or other
              commitments, CognitoMD adapts to your pace and learning style.
            </p>
          </div>
        </section>

        {/* Methodology Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center">
              Powered by Cognitive Science
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Active Recall Card */}
              <Card className="p-8 flex flex-col items-start">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Active Recall</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Instead of passive rereading, our app forces you to retrieve information from memory, strengthening
                  neural pathways and ensuring long-term retention.
                </p>
              </Card>

              {/* Spaced Repetition Card */}
              <Card className="p-8 flex flex-col items-start">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Timer className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Spaced Repetition</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our intelligent algorithm schedules your reviews at the perfect intervals, interrupting the forgetting
                  curve just when you need it most.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Founder's Note Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center">
              A Note from Our Founder
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <Avatar className="w-24 h-24 flex-shrink-0">
                <AvatarImage src="/visionary-leader.png" alt="Founder" />
                <AvatarFallback>CF</AvatarFallback>
              </Avatar>
              <blockquote className="text-lg text-muted-foreground italic leading-relaxed">
                "As someone who has been through the medical licensing journey, I wanted to create the tool I wish I
                had. CognitoMD is that tool. My goal is to empower the next generation of UK doctors with a platform
                that is both powerful and completely free."
              </blockquote>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
