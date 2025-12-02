'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Loading,
  Title,
  Table,
  PageContainer,
  PlusIcon,
  BulkIcon,
  CsvExportButton,
  BookmarkIcon,
} from '@/components/ui';
import { FormError } from '@/components/form';
import { SaveSearchConditionButton } from '@/components/features';
import { useEventLocationManagement } from '../hooks/useEventLocationManagement';
import { useEventLocationCsv } from '../hooks/useEventLocationCsv';
import { useSearchCondition } from '../hooks/useSearchCondition';
import { CreateEventLocationDialog } from './CreateEventLocationDialog';
import { EditEventLocationDialog } from './EditEventLocationDialog';
import { DeleteEventLocationDialog } from './DeleteEventLocationDialog';
import { EventLocationSearchForm } from './EventLocationSearchForm';
import { getTableColumns } from './EventLocationTableColumns';
import { BulkOperationDialog } from '@/components/features/BulkOperationDialog';
import { SaveSearchConditionDialog } from '@/components/features/SaveSearchConditionDialog';
import { SearchConditionListDialog } from '@/components/features/SearchConditionListDialog';
import { errorMessages } from '@/constants/error-messages';

export const EventLocationManagement = () => {
  const eventLocationManagement = useEventLocationManagement();
  const eventLocationCsv = useEventLocationCsv({
    searchParams: eventLocationManagement.searchParams,
    fetchEventLocations: eventLocationManagement.fetchEventLocations,
  });

  const {
    eventLocations,
    isLoading,
    editingEventLocation,
    deletingEventLocation,
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
    setError,
  } = eventLocationManagement;

  const {
    handleExportCSV,
    handleDownloadTemplateCSV,
    handleDownloadEditTemplateCSV,
    handleUploadCSV,
  } = eventLocationCsv;

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
        <Title>ロケーション管理</Title>
        <Loading />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex justify-between items-center">
        <Title>ロケーション管理</Title>
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

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6 mt-6">
        <EventLocationSearchForm
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
          columns={getTableColumns({ startEdit, startDelete })}
          data={eventLocations}
          emptyMessage="ロケーションデータがありません"
        />
      </div>

      <CreateEventLocationDialog
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
        error={error}
      />

      <EditEventLocationDialog
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          cancelEdit();
        }}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
        error={error}
        eventLocation={editingEventLocation}
      />

      <DeleteEventLocationDialog
        isOpen={isDeleting}
        onClose={() => {
          setIsDeleting(false);
          cancelDelete();
        }}
        onConfirm={async () => {
          if (deletingEventLocation) {
            await handleDelete(deletingEventLocation.id);
          }
        }}
        eventLocation={deletingEventLocation}
        isSubmitting={isSubmitting}
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
