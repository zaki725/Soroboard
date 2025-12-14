'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAuth } from '@/hooks/useAuth';
import { Dashboard } from '@/features/dashboard/components/Dashboard';
import { Loading } from '@/components/ui';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { setItems } = useBreadcrumb();
  usePageTitle('ダッシュボード');

  useEffect(() => {
    setItems([{ label: 'ホーム', href: '/' }]);
  }, [setItems]);

  // 認証チェック：ローディング完了後、未認証の場合はログインページにリダイレクト
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // ローディング中または未認証の場合は何も表示しない（リダイレクト中）
  if (isLoading || !user) {
    return <Loading />;
  }

  return <Dashboard />;
}
