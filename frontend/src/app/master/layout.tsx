'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function MasterLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/unauthorized');
    }
  }, [isAdmin, router]);

  if (!isAdmin()) {
    return null;
  }

  return <>{children}</>;
}
