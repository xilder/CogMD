'use client';
import AuthForm from '@/components/auth-form';
import PublicOnlyRoute from '@/components/auth/public-route';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Logo from "@/public/brain-white.png"
import Image from "next/image"


export default function LoginPage() {
  return (
    <PublicOnlyRoute>
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background px-4 py-10'>
        <div className='w-full max-w-md'>
          <div className='text-center mb-8'>
            <div className='rounded-lg flex items-center justify-center mx-auto mb-4'>
              <Link href="/" className="flex items-center gap-2 rounded-lg w-20 h-20 bg-primary rounded-lg justify-center">
            {/* <span className="text-primary-foreground font-bold text-lg">C</span> */}
            <Image src={Logo} alt={"Brain Logo"} className="object-fit"/>
        </Link>
            </div>
            <h1 className='text-3xl font-bold text-foreground mb-2'>
              Welcome Back
            </h1>
            <p className='text-muted-foreground'>
              Login to your CognitoMD account
            </p>
          </div>

          <AuthForm type='login' />

          <p className='text-center text-muted-foreground mt-6'>
            Don't have an account?{' '}
            <Link
              href='/signup'
              className='text-primary hover:underline font-semibold'
            >
              Sign up here
            </Link>
          </p>
          <p className='text-center text-muted-foreground mt-6'>
            Back to Homepage{' '}
            <Button> <Link
              href='/'
              className='hover:underline font-semibold'
            >
              Back</Link>
            </Button>
          </p>
        </div>
      </div>
    </PublicOnlyRoute>
  );
}
