'use client';
import CTASection from '@/components/cta-section';
import FeaturesGrid from '@/components/features-grid';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { useModalInfo } from '@/context/info-modal';

export default function LandingPage() {
  const { setInfo } = useModalInfo();
  // useEffect(() => {
  //   const showGreeting = async () => {
  //     try {
  //       const response = await api.get('/');
  //       const { message } = (await response.data) as { message: string };
  //       setInfo('success', message);
  //     } catch (e) {
  //       setInfo('error', (e as BackendError).response.data.detail);
  //     }
  //   };
  //   // showGreeting();
  // }, []);
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />

      {/* Hero Section */}
      <section className='flex-1 bg-linear-to-br from-primary/5 to-background py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto text-center'>
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance'>
            Master the PLAB Exam with Confidence
          </h1>
          <p className='text-lg sm:text-xl text-muted-foreground mb-8 text-balance'>
            Free, comprehensive study platform designed for international
            medical graduates. Learn smarter, not harder.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/signup'>
              <Button size='lg' className='w-full sm:w-auto'>
                Get Started Free
              </Button>
            </Link>
            <Link href='#features'>
              <Button
                size='lg'
                variant='outline'
                className='w-full sm:w-auto bg-transparent'
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id='features'
        className='py-20 px-4 sm:px-6 lg:px-8 bg-background'
      >
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance'>
              Why Choose CognitoMD?
            </h2>
            <p className='text-lg text-muted-foreground text-balance'>
              Everything you need to succeed in your medical career
            </p>
          </div>
          <FeaturesGrid />
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </div>
  );
}
