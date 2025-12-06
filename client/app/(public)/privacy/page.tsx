import Header from "@/components/header"
import Footer from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-background">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">Last Updated: October 30, 2025</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-3xl mx-auto space-y-12">
            <div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Welcome to CognitoMD. Your privacy is critically important to us. This Privacy Policy outlines the types
                of information we collect, how we use it, and the measures we take to protect it.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information to provide and improve our service:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Personal Information:</strong> When you register for an account,
                  we collect your name, email address, and password (which is securely handled by our authentication
                  provider, Supabase).
                </li>
                <li>
                  <strong className="text-foreground">Usage Data:</strong> We automatically collect data on how you
                  interact with our app. This includes your answers to questions, your performance ratings ('forgot',
                  'good', 'easy'), the time it takes you to answer, and which topics you study.
                </li>
                <li>
                  <strong className="text-foreground">Log Data:</strong> Like most services, we collect log data that
                  may include your IP address, browser type, and the dates and times of your sessions.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your data is used to power the core features of CognitoMD and improve your learning experience:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">To Provide the Service:</strong> We use your account information
                  to authenticate you and give you access to the app.
                </li>
                <li>
                  <strong className="text-foreground">To Power the Spaced Repetition System (SRS):</strong> Your
                  performance data (answers, ratings) is essential for our algorithm to calculate your optimal review
                  schedule.
                </li>
                <li>
                  <strong className="text-foreground">To Provide Personalized Analytics:</strong> We use your usage data
                  to generate your personal performance dashboard, helping you identify your strengths and weaknesses.
                </li>
                <li>
                  <strong className="text-foreground">To Improve the App:</strong> We analyze aggregated, anonymized
                  data to understand which questions are difficult for the community, identify areas for content
                  improvement, and enhance app functionality.
                </li>
                <li>
                  <strong className="text-foreground">To Communicate With You:</strong> We may use your email address to
                  send you important updates about the service or your account.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Data Sharing and Third Parties</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell your personal data. We only share information with essential third-party services that
                help us operate CognitoMD:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Supabase:</strong> Our backend provider for authentication and
                  database storage. All your data is securely stored with them.
                </li>
                <li>
                  <strong className="text-foreground">Vercel/Render:</strong> Our hosting providers for the frontend and
                  backend applications.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                These services are obligated to protect your information and are not permitted to use it for any other
                purpose.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We take data security seriously and use commercially acceptable means to protect your information,
                including encryption and secure authentication protocols. However, no method of transmission over the
                internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to access, update, or request deletion of your personal information. You can manage
                your account information through the app's settings or by contacting us directly at
                contact@cognitomd.com.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new policy on this page.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
