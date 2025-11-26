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
  const { isMaster } = useAuth();

  useEffect(() => {
    if (!isMaster()) {
      router.push('/unauthorized');
    }
  }, [isMaster, router]);

  if (!isMaster()) {
    return null;
  }

  return <>{children}</>;
}
