'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { StudentDetail } from '@/features/student-management/components/StudentDetail';

const StudentDetailPage = () => {
  const { setItems } = useBreadcrumb();
  const params = useParams<{ studentId: string }>();
  const studentId = params.studentId;

  usePageTitle('生徒詳細');

  useEffect(() => {
    setItems([
      { label: 'ホーム', href: '/' },
      { label: '生徒管理', href: '/students' },
      { label: '生徒詳細' },
    ]);
  }, [setItems]);

  return <StudentDetail studentId={studentId} />;
};

export default StudentDetailPage;
