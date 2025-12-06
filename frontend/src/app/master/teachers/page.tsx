'use client';

import { useEffect } from 'react';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { TeacherManagement } from '@/features/teacher-management/components/TeacherManagement';

export default function TeachersPage() {
  const { setItems } = useBreadcrumb();
  usePageTitle('先生管理');

  useEffect(() => {
    setItems([{ label: 'ホーム', href: '/' }, { label: '先生管理' }]);
  }, [setItems]);

  return <TeacherManagement />;
}

