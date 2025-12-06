'use client';

import { useAuth } from '@/context/auth-context';
import { CLIENT } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function PublicOnlyRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const redirectedRef = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && !redirectedRef.current) {
      redirectedRef.current = true;
      router.replace(CLIENT.DASHBOARD);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isAuthenticated) return null;

  return <>{children}</>;
}
