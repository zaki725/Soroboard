'use client';

import { Loading, Title, Table, PageContainer } from '@/components/ui';
import { FormError } from '@/components/form';
import { useTeacherList } from '../hooks/useTeacherList';
import { getTableColumns } from './TeacherTableColumns';

export const TeacherManagement = () => {
  const { teachers, isLoading, error, schoolId } = useTeacherList();

  if (isLoading) {
    return (
      <PageContainer>
        <Title>先生管理</Title>
        <Loading />
      </PageContainer>
    );
  }

  if (!schoolId) {
    return (
      <PageContainer>
        <Title>先生管理</Title>
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <p className="text-gray-600">塾IDが指定されていません。</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Title>先生管理</Title>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6 mt-6">
        <FormError error={error} />

        <Table
          columns={getTableColumns()}
          data={teachers}
          emptyMessage="先生データがありません"
        />
      </div>
    </PageContainer>
  );
};

