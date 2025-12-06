import AuthForm from '@/components/auth-form';
import PublicOnlyRoute from '@/components/auth/public-route';
import { AuthProvider } from '@/context/auth-context';
import Link from 'next/link';

export default function SignupPage() {
  return (
        <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 to-background px-4'>
          <div className='w-full max-w-md'>
            <div className='text-center mb-8'>
              <div className='w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4'>
                <span className='text-primary-foreground font-bold text-xl'>
                  C
                </span>
              </div>
              <h1 className='text-3xl font-bold text-foreground mb-2'>
                Create Account
              </h1>
              <p className='text-muted-foreground'>
                Join CognitoMD and start your PLAB journey
              </p>
            </div>

            <AuthForm type='signup' />

            <p className='text-center text-muted-foreground mt-6'>
              Already have an account?{' '}
              <Link
                href='/login'
                className='text-primary hover:underline font-semibold'
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
  );
}
