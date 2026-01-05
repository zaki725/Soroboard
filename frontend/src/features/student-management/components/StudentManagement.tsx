'use client';

import { Loading, Title, Table, PageContainer } from '@/components/ui';
import { FormError } from '@/components/form';
import { MissingSchoolIdNotice } from '@/components/features';
import { useStudentList } from '../hooks/useStudentList';
import { getTableColumns } from './StudentTableColumns';

export const StudentManagement = () => {
  const { students, isLoading, error, schoolId } = useStudentList();

  if (isLoading) {
    return (
      <PageContainer>
        <Title>生徒管理</Title>
        <Loading />
      </PageContainer>
    );
  }

  if (!schoolId) {
    return (
      <PageContainer>
        <Title>生徒管理</Title>
        <MissingSchoolIdNotice />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Title>生徒管理</Title>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6 mt-6">
        <FormError error={error} />

        <Table
          columns={getTableColumns()}
          data={students}
          emptyMessage="生徒データがありません"
        />
      </div>
    </PageContainer>
  );
};
