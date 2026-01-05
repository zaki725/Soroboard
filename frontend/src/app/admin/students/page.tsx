'use client';

import { useEffect } from 'react';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { StudentManagement } from '@/features/student-management/components/StudentManagement';

export default function StudentsPage() {
  const { setItems } = useBreadcrumb();
  usePageTitle('生徒管理');

  useEffect(() => {
    setItems([{ label: 'ホーム', href: '/' }, { label: '生徒管理' }]);
  }, [setItems]);

  return <StudentManagement />;
}
