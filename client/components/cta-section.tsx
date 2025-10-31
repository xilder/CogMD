import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
    <section className="bg-primary text-primary-foreground py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">Ready to Transform Your Medical Career?</h2>
        <p className="text-lg mb-8 text-primary-foreground/90 text-balance">
          Join thousands of medical graduates who are already preparing for success with CognitoMD.
        </p>
        <Link href="/signup">
          <Button size="lg" variant="secondary">
            Start Your Free Trial Today
          </Button>
        </Link>
      </div>
    </section>
  )
}
