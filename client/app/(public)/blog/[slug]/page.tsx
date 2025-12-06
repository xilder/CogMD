import Footer from '@/components/footer';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

const blogPosts: Record<
  string,
  {
    title: string;
    author: string;
    publishedDate: string;
    content: string;
  }
> = {
  'beyond-rote-memorization': {
    title:
      'Beyond Rote Memorization: How to Actually Retain Information for the PLAB Exam',
    author: 'Dr. Sarah Chen',
    publishedDate: '2024-01-15',
    content: `The sheer volume of information required for the PLAB exam can feel overwhelming. For many medical students, the default study method becomes a cycle of cramming and forgetting. But what if you could study more efficiently and build lasting knowledge? The key isn't studying harder, but studying smarter, using principles from cognitive science.

Two of the most powerful, evidence-based techniques are Active Recall and Spaced Repetition.

## What is Active Recall?

Active recall is the process of actively retrieving information from your memory, rather than passively reviewing it.

**Passive Review (Ineffective):** Rereading your notes, highlighting a textbook, or watching a lecture for the fifth time. This creates an "illusion of competence"—you recognize the material, but you can't necessarily recall it under pressure.

**Active Recall (Effective):** Forcing your brain to pull out the answer. This is the mental equivalent of lifting a weight. The effort itself is what builds the "muscle" of memory. Answering a practice question without looking at the answer is a perfect example of active recall.

## What is Spaced Repetition?

Spaced repetition is a method for scheduling when you review material. It's based on the "forgetting curve," which shows that we naturally forget information over time. To combat this, you review information at increasing intervals—just as you're about to forget it.

- Day 1: Learn a new concept (e.g., the management of acute asthma).
- Day 2: Review it.
- Day 4: Review it again.
- Day 9: Review it again.

Each time you successfully recall the information, the interval gets longer. This process interrupts the forgetting curve and systematically moves knowledge from your short-term to your long-term memory.

## How CognitoMD Puts This into Practice

CognitoMD was built from the ground up on these principles.

Every question you answer is an act of active recall. Our intelligent algorithm tracks your performance on every single question. When you rate a question as 'good' or 'easy', our spaced repetition system automatically schedules its next appearance in your review queue at the optimal time.

By integrating these proven methods, we help you stop cramming and start building the durable, long-term knowledge you need to succeed on the PLAB and beyond.`,
  },
  'hidden-curriculum': {
    title:
      'The Hidden Curriculum: Mastering Ethics and Communication for the PLAB',
    author: 'Dr. James Wilson',
    publishedDate: '2024-01-10',
    content: `While clinical knowledge is the foundation of your PLAB preparation, many high-achieving candidates are surprised to find that it's often the "soft skills" that make the difference. The PLAB exam isn't just testing what you know; it's testing your ability to practice medicine safely and professionally within the UK healthcare system.

This "hidden curriculum" revolves around two key pillars: ethical principles and patient-centered communication.

## Understanding the GMC's "Good Medical Practice"

The General Medical Council (GMC) provides the core ethical framework for all doctors practicing in the UK. The PLAB exam is designed to ensure you understand and can apply these standards. It's not enough to know the right diagnosis; you must know how to act with honesty, integrity, and in partnership with your patients.

Key domains you must be familiar with include:

- **Domain 2: Patients, partnership and communication:** This covers everything from treating patients with kindness and respect to supporting them in making informed decisions about their care.
- **Domain 4: Trust and professionalism:** This involves maintaining professional boundaries, managing conflicts of interest, and acting with integrity at all times.

Instead of just memorizing these rules, think about how they apply to clinical scenarios. For example, a question about a patient refusing a life-saving treatment isn't just a clinical problem—it's a test of your understanding of consent and patient autonomy.

## Communication is a Clinical Skill

In the UK system, communication is not an afterthought; it is a core clinical skill. The PLAB 2 (OSCE) exam, in particular, heavily assesses your ability to:

- Listen Actively: Show that you are hearing and understanding the patient's concerns.
- Explain Clearly: Break down complex medical information into simple, jargon-free language.
- Show Empathy: Acknowledge the patient's feelings and demonstrate that you care.

## How to Prepare

- Read "Good Medical Practice": Make reading the GMC's core guidance a priority. It's as high-yield as any clinical textbook.
- Practice with Ethical Scenarios: When you encounter an ethics-based question in your QBank, don't just learn the answer. Ask yourself why it aligns with GMC principles.
- Role-Play for PLAB 2: Find a study partner and practice communication-heavy stations like "breaking bad news" or "counseling an angry patient".

Mastering these skills will not only boost your exam score but will also prepare you for a successful and fulfilling career as a doctor in the UK.`,
  },
  'managing-burnout': {
    title: 'Managing PLAB Prep Burnout: A Practical Guide for Busy Doctors',
    author: 'Dr. Priya Patel',
    publishedDate: '2024-01-05',
    content: `Preparing for the PLAB exam is a marathon, not a sprint. For many international medical graduates, this preparation happens alongside a demanding full-time job, family commitments, and the stress of a major life transition. It's a recipe for burnout.

Recognizing the signs of burnout—exhaustion, cynicism, and a feeling of ineffectiveness—is the first step. But preventing it requires a proactive strategy. Here are three practical, evidence-based tips to manage your energy and maintain your well-being during your PLAB journey.

## 1. Ditch the Cramming: Embrace Consistency

The single biggest cause of burnout is the "all-or-nothing" study approach: doing nothing for a week, followed by a panicked 12-hour cramming session on a Sunday. This is both ineffective for learning and devastating for your mental health.

**The Solution: The "Little and Often" Approach.** Aim for consistency over intensity. Studying for 60-90 minutes every day is far more sustainable and effective than one heroic, exhausting session per week. This approach aligns with the principles of spaced repetition, helping you build long-term memory without overwhelming your brain. Use a tool that helps you track your daily progress and build a consistent habit.

## 2. Schedule Your Downtime (Seriously)

When you're a busy doctor, rest doesn't just happen; it has to be scheduled. If you don't intentionally block out time for rest and recovery, your study and work obligations will inevitably fill every waking moment.

**The Solution: Timebox Your Breaks.** Just as you schedule a study block for "Cardiology," schedule a 30-minute walk, a coffee with a friend, or an hour to watch your favorite show. Treat this protected time with the same importance as a study session. This isn't a luxury; it's a crucial part of the learning process. Sleep, in particular, is when your brain consolidates memories, so sacrificing it for extra study time is counterproductive.

## 3. Focus on the Process, Not Just the Outcome

Obsessing over the final exam result can create immense pressure and anxiety. While the goal is important, focusing on your daily process can make the journey more manageable and rewarding.

**The Solution: Set Process-Based Goals.** Instead of "I need to pass the PLAB," set goals like:

- "I will answer 50 practice questions today."
- "I will review all my 'lapsed' flashcards this morning."
- "I will spend 20 minutes reading one NICE guideline."

These small, achievable daily wins build momentum and confidence. They shift your focus from a daunting, far-off outcome to a series of manageable tasks you can control today. This sense of agency is a powerful antidote to the feeling of being overwhelmed.

Remember, taking care of yourself isn't a distraction from your PLAB preparation—it's an essential part of it. A well-rested, focused mind is your most powerful study tool.`,
  },
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    return (
      <div className='min-h-screen flex flex-col'>
        <Header />
        <main className='flex-1 flex items-center justify-center py-20'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-foreground mb-4'>
              Post not found
            </h1>
            <Link href='/blog'>
              <Button>Back to Blog</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />

      <main className='flex-1 py-20 px-4 sm:px-6 lg:px-8 bg-background'>
        <div className='max-w-3xl mx-auto'>
          {/* Back Link */}
          <Link href='/blog' className='inline-block mb-8'>
            <Button variant='ghost'>
              <ArrowLeft size={20} className='mr-2' />
              Back to Blog
            </Button>
          </Link>

          {/* Article */}
          <article className='prose prose-lg max-w-none'>
            <h1 className='text-4xl font-bold text-foreground mb-4'>
              {post.title}
            </h1>

            {/* Metadata */}
            <div className='flex items-center gap-4 text-muted-foreground text-sm mb-8 pb-8 border-b border-border'>
              <span>
                Published on {new Date(post.publishedDate).toLocaleDateString()}
              </span>
              <span>By {post.author}</span>
            </div>

            {/* Content */}
            <div className='text-foreground leading-relaxed space-y-4'>
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </article>

          {/* Back Link at Bottom */}
          <div className='mt-12 pt-8 border-t border-border'>
            <Link href='/blog'>
              <Button variant='outline'>Back to Blog</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
