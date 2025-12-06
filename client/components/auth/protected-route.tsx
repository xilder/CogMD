'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { CLIENT } from '@/lib/routes';
import Loading from '@/app/loading';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const redirectedRef = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && !redirectedRef.current) {
      redirectedRef.current = true;
      router.replace(CLIENT.LOGIN);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
