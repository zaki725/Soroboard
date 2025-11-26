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
    if (!hasRole('admin')) {
      router.push('/unauthorized');
    }
  }, [hasRole, router]);

  if (!hasRole('admin')) {
    return null;
  }

  return <>{children}</>;
}
