'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const router = useRouter();
  const { hasRole } = useAuth();

  useEffect(() => {
    if (!hasRole('ADMIN')) {
      router.push('/unauthorized');
    }
  }, [hasRole, router]);

  if (!hasRole('ADMIN')) {
    return null;
  }

  return <>{children}</>;
}
