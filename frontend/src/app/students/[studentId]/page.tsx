'use client';

import { useEffect } from 'react';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { MissingSchoolIdNotice } from '@/components/features';
import { Title, PageContainer } from '@/components/ui';
import { StudentDetail } from '@/features/student-management/components/StudentDetail';
import { useParams, useSearchParams } from 'next/navigation';
import { usePageTitle } from '@/hooks/usePageTitle';

const StudentDetailPage = () => {
  const { setItems } = useBreadcrumb();
  const params = useParams<{ studentId: string }>();
  const searchParams = useSearchParams();

  const schoolId = searchParams.get('schoolId');
  const studentId = params.studentId;
  usePageTitle('生徒詳細');

  useEffect(() => {
    setItems([
      { label: 'ホーム', href: '/' },
      { label: '生徒管理', href: schoolId ? `/students?schoolId=${schoolId}` : '/students' },
      { label: '生徒詳細' },
    ]);
  }, [setItems, schoolId]);

  if (!schoolId) {
    return (
      <PageContainer>
        <Title>生徒詳細</Title>
        <MissingSchoolIdNotice />
      </PageContainer>
    );
  }
  return <StudentDetail studentId={studentId} schoolId={schoolId} />
}

export default StudentDetailPage;
