'use client';

import { useState, useEffect } from 'react';

import {
  Button,
  Loading,
  Title,
  Table,
  PageContainer,
  CsvExportButton,
  PlusIcon,
  BulkIcon,
  BookmarkIcon,
} from '@/components/ui';
import { FormError } from '@/components/form';
import { SaveSearchConditionButton } from '@/components/features';
import { useCompanyManagement } from '../hooks/useCompanyManagement';
import { useSearchCondition } from '../hooks/useSearchCondition';
import { CreateCompanyDialog } from './CreateCompanyDialog';
import { EditCompanyDialog } from './EditCompanyDialog';
import { BulkOperationDialog } from '@/components/features/BulkOperationDialog';
import { SaveSearchConditionDialog } from '@/components/features/SaveSearchConditionDialog';
import { SearchConditionListDialog } from '@/components/features/SearchConditionListDialog';
import { CompanySearchForm } from './CompanySearchForm';
import { getTableColumns } from './CompanyTableColumns';
import { errorMessages } from '@/constants/error-messages';

export const CompanyManagement = () => {
  const {
    companies,
    isLoading,
    editingCompany,
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
    handleSearch,
    handleReset,
    searchParams,
    setError,
    handleExportCSV,
    handleDownloadTemplateCSV,
    handleDownloadEditTemplateCSV,
    handleUploadCSV,
  } = useCompanyManagement();

  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
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
        <Title>会社管理</Title>
        <Loading />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex justify-between items-center">
        <Title>会社管理</Title>
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
          <Button variant="primary" onClick={() => setIsCreating(true)}>
            <div className="flex items-center gap-2">
              <PlusIcon />
              <span>新規登録</span>
            </div>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <CompanySearchForm
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
          <div className="flex gap-2">
            <CsvExportButton
              onExport={async () => {
                try {
                  await handleExportCSV();
                } catch (err) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : errorMessages.csvExportFailed,
                  );
                }
              }}
              variant="outline"
            >
              CSV出力
            </CsvExportButton>
          </div>
        </div>

        <FormError error={error} />

        <Table
          columns={getTableColumns({ startEdit })}
          data={companies}
          emptyMessage="会社データがありません"
        />
      </div>

      <CreateCompanyDialog
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
        error={error}
      />

      <EditCompanyDialog
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          cancelEdit();
        }}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
        error={error}
        company={editingCompany}
      />

      <BulkOperationDialog
        isOpen={isBulkDialogOpen}
        onClose={() => setIsBulkDialogOpen(false)}
        onDownloadTemplateCSV={handleDownloadTemplateCSV}
        onDownloadEditTemplateCSV={handleDownloadEditTemplateCSV}
        onUploadCSV={handleUploadCSV}
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
