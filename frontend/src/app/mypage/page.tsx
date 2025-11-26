'use client';

import { useEffect } from 'react';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { MyPage as MyPageComponent } from '@/features/mypage/components/MyPage';

export default function MyPage() {
  const { setItems } = useBreadcrumb();
  usePageTitle('マイページ');

  useEffect(() => {
    setItems([{ label: 'ホーム', href: '/' }, { label: 'マイページ' }]);
  }, [setItems]);

  return <MyPageComponent />;
}
