'use client';

import { useAuth } from '@/context/auth-context';
import { CLIENT } from '@/lib/routes';
import { handleGoogleCallback } from '@/services/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function GoogleCallback() {
  const params = useSearchParams();
  const router = useRouter();
  const { updateUser } = useAuth();

  useEffect(() => {
    const finalizeLogin = async () => {
      try {
        const code = params.get('code');
        const code_verifier = sessionStorage.getItem('code_verifier');
        if (!code || !code_verifier) {
          throw new Error('Missing OAuth credentials');
        }

        const { user } = await handleGoogleCallback({
          code,
          code_verifier,
        });

        if (!user) {
          throw new Error('User retrieval failed');
        }

        sessionStorage.removeItem('code_verifier');
        updateUser(user);
        router.push(CLIENT.DASHBOARD);
      } catch (error) {
        sessionStorage.removeItem('code_verifier');
        router.push('/login?error=callback_failed');
      } 
    };
    finalizeLogin();
  }, [params]);

  return <div>Signing you in…</div>;
}
