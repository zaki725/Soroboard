'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { UniversityDetail } from '@/features/university-management/components/detail/UniversityDetail';

export default function UniversityDetailPage() {
  const params = useParams();
  const universityId = params?.id as string;
  const { setItems } = useBreadcrumb();
  usePageTitle('大学詳細');

  useEffect(() => {
    setItems([
      { label: 'ホーム', href: '/' },
      { label: '大学管理', href: '/master/university-management' },
      { label: '詳細' },
    ]);
  }, [setItems]);

  if (!universityId) {
    return <div>大学IDが指定されていません</div>;
  }

  return <UniversityDetail universityId={universityId} />;
}
