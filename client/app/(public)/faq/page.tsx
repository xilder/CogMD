import Footer from "@/components/footer"
import Header from "@/components/header"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      question: "What is CognitoMD?",
      answer:
        "CognitoMD is a free, evidence-based study platform designed specifically for international medical doctors (IMGs) preparing for the UK's Professional and Linguistic Assessments Board (PLAB) exam. Our mission is to make high-quality medical education accessible to everyone.",
    },
    {
      question: "How does the learning system work?",
      answer:
        "Our app is built on two powerful principles from cognitive science: Active Recall and Spaced Repetition. Instead of just rereading notes, you actively test yourself with questions. Our smart algorithm then schedules your next review for each question at the perfect time to interrupt the 'forgetting curve' and build strong, long-term memories.",
    },
    {
      question: "Is CognitoMD really free?",
      answer:
        "Yes, the core features of CognitoMD, including access to the full question bank and the spaced repetition system, are completely free. Our goal is to build a large, supportive community. In the future, we may introduce optional premium features to help sustain the platform, but the core learning experience will always remain free.",
    },
    {
      question: "Who are the questions for?",
      answer:
        "Our question bank is tailored for medical students and doctors preparing for the PLAB 1 exam. The content is designed to reflect the style and scope of questions you will encounter, with a focus on common clinical problems and UK-based guidelines.",
    },
    {
      question: "How is my data used?",
      answer:
        "Your data is used to power your personalized learning experience. We track your performance on each question to calculate your unique review schedule and to show you your strengths and weaknesses on your analytics dashboard. We take your privacy very seriously. For more details, please read our full Privacy Policy.",
    },
    {
      question: "Can I use the app on my phone?",
      answer:
        "Yes! CognitoMD is a fully responsive web application, which means it is designed to work seamlessly on your desktop, tablet, and mobile phone browser. There's no need to download anything from an app store.",
    },
    {
      question: "I found an error in a question. What should I do?",
      answer:
        "We strive for 100% accuracy, but with thousands of questions, errors can occasionally occur. We are currently building a feature that will allow you to flag questions directly within the app. For now, please send us a message through our Contact Us page with the question details, and we will correct it immediately.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-background">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Frequently Asked Questions
            </h1>
            <h3 className="text-lg sm:text-xl text-muted-foreground text-balance">
              Have a question? We've got answers. If you can't find what you're looking for, feel free to contact us.
            </h3>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
