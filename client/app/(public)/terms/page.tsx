import Header from "@/components/header"
import Footer from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-background">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">Last Updated: October 30, 2025</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-3xl mx-auto space-y-12">
            <div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Welcome to CognitoMD. These Terms of Service ("Terms") govern your use of the CognitoMD application and
                services ("Service"). By creating an account or using the Service, you agree to be bound by these Terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Use of the Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                CognitoMD grants you a limited, non-exclusive, non-transferable license to use the Service for your
                personal, non-commercial educational purposes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. User Conduct and Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree not to misuse the Service. Prohibited actions include:
              </p>
              <ul className="space-y-3 text-muted-foreground list-disc list-inside">
                <li>Attempting to reverse-engineer, decompile, or access the source code.</li>
                <li>Using automated scripts or bots to access the question bank.</li>
                <li>Sharing your account with others.</li>
                <li>Using the Service for any illegal or unauthorized purpose.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content provided on the Service, including the questions, explanations, and software, is the
                exclusive property of CognitoMD and its licensors. You may not copy, distribute, or create derivative
                works from our content without our express permission.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                4. Disclaimer of Warranties and Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">No Medical Advice</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    CognitoMD is an educational tool for exam preparation. It is not a substitute for professional
                    medical advice, diagnosis, or treatment. Always seek the advice of a qualified health provider with
                    any questions you may have regarding a medical condition.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Limitation of Liability</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To the fullest extent permitted by law, CognitoMD shall not be liable for any indirect, incidental,
                    or consequential damages arising out of your use of the Service.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Account Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate your account at our discretion if you violate these Terms.
                You may terminate your account at any time by contacting us.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may modify these Terms at any time. We will provide notice of significant changes. Your continued use
                of the Service after such changes constitutes your acceptance of the new Terms.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
