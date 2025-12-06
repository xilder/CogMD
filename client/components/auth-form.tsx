'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { useModalInfo } from '@/context/info-modal';
import { CLIENT } from '@/lib/routes';
import { handleGoogleLogin } from '@/lib/utils';
import { login, register as registerFn } from '@/services/api';
import {
  BackendError,
  loginSchema,
  registerSchema,
  UserCreate,
  UserLogin,
} from '@/types/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Chrome, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

interface AuthFormProps {
  type: 'login' | 'signup';
}

type FormValues = UserCreate & UserLogin;

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const { setInfo } = useModalInfo();
  const { updateUser } = useAuth();

  const { register, formState, handleSubmit } = useForm<FormValues>({
    mode: 'onSubmit',
    resolver:
      type === 'signup'
        ? zodResolver(registerSchema)
        : zodResolver(loginSchema),
    defaultValues:
      type === 'signup'
        ? {
            username: '',
            password: '',
            full_name: '',
            email: '',
            confirm_password: '',
            acceptedTermsOfUse: false,
          }
        : {
            username: '',
            password: '',
          },
  });

  const { errors, isDirty, isValid, isSubmitting } = formState;

  const loginMutation = useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: login,
    onSuccess: (data) => {
      updateUser(data.user);
      router.push(CLIENT.DASHBOARD);
    },
    onError: (e) => {
      console.log(e)
      setInfo('error', e.message);
    },
  });

  const registerMutation = useMutation({
    mutationKey: ['auth', 'register'],
    mutationFn: registerFn,
    onSuccess: (_) => {
      router.push(CLIENT.LOGIN);
    },
    onError: (e) => {
      setInfo('error', (e as BackendError).response.data.detail);
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (type === 'login') {
      loginMutation.mutate(data as UserLogin);
    } else {
      registerMutation.mutate(data as UserCreate);
    }
  };

  // const handleGoogleLogin = async () => {
  //   const { url } = await getGoogleAuthUrl();
  //   const code_challenge = new URLSearchParams(url).get('code_challenge');
  //   console.error(code_challenge + ' \n');
  //   console.log(url);
  //   sessionStorage.setItem('code_challenge', code_challenge!);
  //   await supabase.auth.signInWithOAuth({
  //     provider: 'google',
  //     options: {
  //       redirectTo: 'http://localhost:3000/callback',
  //     },
  //   });
  //   console.log(Object.entries(localStorage));

  //   window.location.href = url;
  // };

  return (
    <Card className='border-border'>
      <CardContent className='pt-6'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {type === 'signup' && (
            <>
              <div className='space-y-2'>
                <label
                  htmlFor='full_name'
                  className='text-sm font-medium text-foreground'
                >
                  Full Name
                </label>
                <div className='relative flex items-center'>
                  <Mail className='absolute left-3 w-5 h-5 text-muted-foreground' />
                  <Input
                    id='full_name'
                    type='text'
                    placeholder='Gbenga Daniels'
                    className='pl-10'
                    {...register('full_name')}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.full_name && (
                  <p className='mt-1 text-xs'>{errors.full_name?.message}</p>
                )}
              </div>
              {/* Email Field */}
              <div className='space-y-2'>
                <label
                  htmlFor='email'
                  className='text-sm font-medium text-foreground'
                >
                  Email Address
                </label>
                <div className='relative flex items-center'>
                  <Mail className='absolute left-3 w-5 h-5 text-muted-foreground' />
                  <Input
                    id='email'
                    type='email'
                    placeholder='you@example.com'
                    className='pl-10'
                    {...register('email')}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className='mt-1 text-xs'>{errors.email?.message}</p>
                )}
              </div>
            </>
          )}

          {/* Username Field */}
          <div className='space-y-2'>
            <label
              htmlFor='username'
              className='text-sm font-medium text-foreground'
            >
              Username
            </label>
            <div className='relative flex items-center'>
              <Mail className='absolute left-3 w-5 h-5 text-muted-foreground' />
              <Input
                id='username'
                type='text'
                placeholder='thunderbolt'
                className='pl-10'
                {...register('username')}
                disabled={isSubmitting}
              />
            </div>
            {errors.username && (
              <p className='mt-1 text-xs'>{errors.username.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className='space-y-2'>
            <label
              htmlFor='password'
              className='text-sm font-medium text-foreground'
            >
              Password
            </label>
            <div className='relative flex items-center'>
              <Lock className='absolute left-3 w-5 h-5 text-muted-foreground' />
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                {...register('password')}
                className='pl-10'
                disabled={isSubmitting}
              />
            </div>
            {errors.password && (
              <p className='mt-1 text-xs'>{errors.password.message}</p>
            )}
          </div>

          {type === 'signup' && (
            <>
              <div className='space-y-2'>
                <label
                  htmlFor='confirmPassword'
                  className='text-sm font-medium text-foreground'
                >
                  Confirm Password
                </label>
                <div className='relative flex items-center'>
                  <Lock className='absolute left-3 w-5 h-5 text-muted-foreground' />
                  <Input
                    id='confirmPassword'
                    type='password'
                    placeholder='••••••••'
                    {...register('confirm_password')}
                    className='pl-10'
                    disabled={isSubmitting}
                  />
                </div>
                {errors.confirm_password && (
                  <p className='mt-1 text-xs'>
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    className='border-2'
                    id='acceptedTermsOfUse'
                    {...register('acceptedTermsOfUse')}
                  />
                  <p className='ml-5 text-sm'>
                    I agree to the{' '}
                    <Link href='/terms' className='text-primary'>
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href='/privacy' className='text-primary'>
                      Privacy Policy.
                    </Link>
                  </p>
                </div>
                {errors.acceptedTermsOfUse && (
                  <p className='mt-1 text-xs'>
                    {errors.acceptedTermsOfUse.message}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Submit Button */}
          <Button
            type='submit'
            className='w-full'
            disabled={
              !isValid ||
              !isDirty ||
              loginMutation.isPending ||
              registerMutation.isPending
            }
          >
            {isSubmitting
              ? 'Loading...'
              : type === 'signup'
              ? 'Create Account'
              : 'Login'}
          </Button>

          {/* Divider */}
          <div className='relative my-6'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-border'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-card text-muted-foreground'>
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type='button'
            variant='outline'
            className='w-full bg-transparent'
            disabled={loginMutation.isPending || registerMutation.isPending}
            onClick={handleGoogleLogin}
          >
            <Chrome className='w-4 h-4 mr-2' />
            Google
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
