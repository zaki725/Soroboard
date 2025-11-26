'use client';

import { useState, useEffect } from 'react';
import {
  Title,
  PageContainer,
  Button,
  Table,
  PlusIcon,
  Loading,
  BulkIcon,
  BookmarkIcon,
} from '@/components/ui';
import { FormError } from '@/components/form';
import { SaveSearchConditionButton } from '@/components/features';
import { CreateInterviewerDialog } from '@/features/user-management/components/CreateInterviewerDialog';
import { EditInterviewerDialog } from './EditInterviewerDialog';
import { DeleteInterviewerDialog } from './DeleteInterviewerDialog';
import { InterviewerSearchForm } from './InterviewerSearchForm';
import { BulkOperationDialog } from '@/components/features/BulkOperationDialog';
import { SaveSearchConditionDialog } from '@/components/features/SaveSearchConditionDialog';
import { SearchConditionListDialog } from '@/components/features/SearchConditionListDialog';
import { useInterviewerManagementPage } from '../hooks/useInterviewerManagementPage';
import { useSearchCondition } from '../hooks/useSearchCondition';

export const InterviewerManagement = () => {
  const {
    isLoading,
    error,
    searchParams,
    data,
    columns,
    users,
    departments,
    editingInterviewer,
    deletingInterviewer,
    isSubmitting,
    isEditing,
    isDeleting,
    isBulkDialogOpen,
    setIsBulkDialogOpen,
    interviewerCsv,
    interviewerRegistration,
    handleSearch,
    handleReset,
    handleUpdate,
    handleCloseEditDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
    setError,
  } = useInterviewerManagementPage();

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

  const hasSearchConditions =
    !!searchParams.userId || !!searchParams.search || !!searchParams.category;

  if (isLoading) {
    return (
      <PageContainer>
        <Title>面接官管理</Title>
        <Loading />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex justify-between items-center">
        <Title>面接官管理</Title>
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={() => setIsBulkDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-md"
          >
            <div className="flex items-center gap-2">
              <BulkIcon />
              <span>一括処理</span>
            </div>
          </Button>
          <Button
            variant="primary"
            onClick={() => interviewerRegistration.setIsCreating(true)}
          >
            <div className="flex items-center gap-2">
              <PlusIcon />
              <span>新規登録</span>
            </div>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6 mt-6">
        <InterviewerSearchForm
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
          columns={columns}
          data={data}
          emptyMessage="面接官データがありません"
        />
      </div>

      <CreateInterviewerDialog
        isOpen={interviewerRegistration.isCreating}
        onClose={() => interviewerRegistration.setIsCreating(false)}
        onSubmit={interviewerRegistration.handleCreate}
        isSubmitting={interviewerRegistration.isSubmitting}
        error={error}
        users={users}
      />

      <EditInterviewerDialog
        isOpen={isEditing}
        onClose={handleCloseEditDialog}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
        error={error}
        interviewer={editingInterviewer}
        departments={departments}
      />

      <DeleteInterviewerDialog
        isOpen={isDeleting}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        interviewer={deletingInterviewer}
        isSubmitting={isSubmitting}
      />

      <BulkOperationDialog
        isOpen={isBulkDialogOpen}
        onClose={() => setIsBulkDialogOpen(false)}
        onDownloadTemplateCSV={interviewerCsv.handleDownloadTemplateCSV}
        onDownloadEditTemplateCSV={interviewerCsv.handleDownloadEditTemplateCSV}
        onUploadCSV={interviewerCsv.handleUploadCSV}
        onError={setError}
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
