'use client';

import { useRecruitYear } from '@/contexts/RecruitYearContext';
import {
  Button,
  Loading,
  Title,
  Table,
  PageContainer,
  PlusIcon,
} from '@/components/ui';
import { FormError } from '@/components/form';
import { useRecruitYearManagement } from '../hooks/useRecruitYearManagement';
import { CreateYearDialog } from './CreateYearDialog';
import { EditYearDialog } from './EditYearDialog';
import { getTableColumns } from './RecruitYearTableColumns';

export const RecruitYearManagement = () => {
  const { recruitYears, isLoading } = useRecruitYear();
  const {
    editingYear,
    isSubmitting,
    error,
    isCreating,
    setIsCreating,
    isEditing,
    setIsEditing,
    startEdit,
    cancelEdit,
    handleUpdate,
    handleCreate,
  } = useRecruitYearManagement();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between ">
        <Title>年度管理</Title>
        <Button variant="primary" onClick={() => setIsCreating(true)}>
          <div className="flex items-center gap-2">
            <PlusIcon />
            <span>新規登録</span>
          </div>
        </Button>
      </div>

      <FormError error={error} />

      <div className="bg-white rounded-lg shadow-md p-6">
        <Table
          columns={getTableColumns({ startEdit })}
          data={recruitYears.map((year) => ({
            recruitYear: year.recruitYear,
            displayName: year.displayName,
            themeColor: year.themeColor,
            id: year.recruitYear,
          }))}
          emptyMessage="年度データがありません"
        />
      </div>

      <CreateYearDialog
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
        error={error}
      />

      <EditYearDialog
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          cancelEdit();
        }}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
        error={error}
        year={editingYear}
      />
    </PageContainer>
  );
};
