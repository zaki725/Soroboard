'use client';

import { useEffect } from 'react';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { InterviewerManagement } from '@/features/interviewer-management/components/list/InterviewerManagement';

export default function InterviewerManagementPage() {
  const { setItems } = useBreadcrumb();
  usePageTitle('面接官管理');

  useEffect(() => {
    setItems([{ label: 'ホーム', href: '/' }, { label: '面接官管理' }]);
  }, [setItems]);

  return <InterviewerManagement />;
}
