'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Loading,
  Title,
  Table,
  PageContainer,
  PlusIcon,
  BookmarkIcon,
} from '@/components/ui';
import { FormError } from '@/components/form';
import { SaveSearchConditionButton } from '@/components/features';
import { useDepartmentManagement } from '../hooks/useDepartmentManagement';
import { useSearchCondition } from '../hooks/useSearchCondition';
import { CreateDepartmentDialog } from './CreateDepartmentDialog';
import { EditDepartmentDialog } from './EditDepartmentDialog';
import { DeleteDepartmentDialog } from './DeleteDepartmentDialog';
import { SaveSearchConditionDialog } from '@/components/features/SaveSearchConditionDialog';
import { SearchConditionListDialog } from '@/components/features/SearchConditionListDialog';
import { DepartmentSearchForm } from './DepartmentSearchForm';
import { getTableColumns } from './DepartmentTableColumns';

export const DepartmentManagement = () => {
  const {
    departments,
    isLoading,
    editingDepartment,
    deletingDepartment,
    isSubmitting,
    error,
    isCreating,
    setIsCreating,
    isEditing,
    setIsEditing,
    isDeleting,
    setIsDeleting,
    startEdit,
    startDelete,
    cancelEdit,
    cancelDelete,
    handleUpdate,
    handleCreate,
    handleDelete,
    handleSearch,
    handleReset,
    searchParams,
  } = useDepartmentManagement();

  const [isSaveConditionDialogOpen, setIsSaveConditionDialogOpen] =
    useState(false);
  const [isSearchConditionListDialogOpen, setIsSearchConditionListDialogOpen] =
    useState(false);

  const {
    filteredConditions,
    isLoading: isSearchConditionLoading,
    fetchSavedConditions,
    searchConditions,
    saveCondition,
    deleteCondition,
    applyCondition,
  } = useSearchCondition();

  useEffect(() => {
    void fetchSavedConditions();
  }, [fetchSavedConditions]);

  const hasSearchConditions = !!searchParams.id || !!searchParams.search;

  if (isLoading) {
    return (
      <PageContainer>
        <Title>部署管理</Title>
        <Loading />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex justify-between items-center">
        <Title>部署管理</Title>
        <Button variant="primary" onClick={() => setIsCreating(true)}>
          <div className="flex items-center gap-2">
            <PlusIcon />
            <span>新規登録</span>
          </div>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6 mt-6">
        <DepartmentSearchForm
          onSearch={handleSearch}
          onReset={handleReset}
          searchParams={searchParams}
        />

        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex gap-2 items-center flex-wrap">
            <SaveSearchConditionButton
              onClick={() => setIsSaveConditionDialogOpen(true)}
              disabled={!hasSearchConditions}
            />
            <Button
              variant="outline"
              onClick={() => setIsSearchConditionListDialogOpen(true)}
              icon={<BookmarkIcon />}
            >
              検索条件一覧
            </Button>
          </div>
        </div>

        <FormError error={error} />

        <Table
          columns={getTableColumns({ startEdit, startDelete })}
          data={departments}
          emptyMessage="部署データがありません"
        />
      </div>

      <CreateDepartmentDialog
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
        error={error}
      />

      <EditDepartmentDialog
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          cancelEdit();
        }}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
        error={error}
        department={editingDepartment}
      />

      <DeleteDepartmentDialog
        isOpen={isDeleting}
        onClose={() => {
          setIsDeleting(false);
          cancelDelete();
        }}
        onConfirm={async () => {
          if (deletingDepartment) {
            await handleDelete(deletingDepartment.id);
          }
        }}
        department={deletingDepartment}
        isSubmitting={isSubmitting}
      />

      <SaveSearchConditionDialog
        isOpen={isSaveConditionDialogOpen}
        onClose={() => setIsSaveConditionDialogOpen(false)}
        onSave={saveCondition}
      />

      <SearchConditionListDialog
        isOpen={isSearchConditionListDialogOpen}
        onClose={() => setIsSearchConditionListDialogOpen(false)}
        conditions={filteredConditions}
        onDelete={deleteCondition}
        onSearch={searchConditions}
        onApply={applyCondition}
        isLoading={isSearchConditionLoading}
      />
    </PageContainer>
  );
};
