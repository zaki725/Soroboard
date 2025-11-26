'use client';

import { useEffect } from 'react';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { ApplicantList } from '@/features/applicant/components/ApplicantList';

export default function ApplicantsPage() {
  const { setItems } = useBreadcrumb();
  usePageTitle('応募者検索・一覧');

  useEffect(() => {
    setItems([{ label: 'ホーム', href: '/' }, { label: '応募者検索・一覧' }]);
  }, [setItems]);

  return <ApplicantList />;
}
