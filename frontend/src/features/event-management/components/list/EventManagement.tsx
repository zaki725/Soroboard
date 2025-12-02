'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loading, PageContainer } from '@/components/ui';
import {
  DeleteDialog,
  SaveSearchConditionDialog,
  SearchConditionListDialog,
} from '@/components/features';
import { BulkOperationDialog } from '@/components/features/BulkOperationDialog';
import { useEventList } from '../../hooks/list/useEventList';
import { useEventManagement } from '../../hooks/list/useEventManagement';
import { useEventCsv } from '../../hooks/list/useEventCsv';
import { useSearchCondition } from '../../hooks/useSearchCondition';
import type { EventFormData, EventResponseDto } from '@/types/event';
import { EventManagementHeader } from './EventManagementHeader';
import { EventManagementContent } from './EventManagementContent';
import { CreateEventDialog } from './CreateEventDialog';
import { EditEventDialog } from './EditEventDialog';

export const EventManagement = () => {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const {
    events,
    isLoading,
    searchParams,
    handleSearch,
    handleReset,
    refetch,
  } = useEventList();

  const { handleCreate, handleUpdate, handleDelete } = useEventManagement();
  const eventCsv = useEventCsv({
    searchParams,
    fetchEvents: refetch,
  });

  const {
    handleExportCSV,
    handleDownloadTemplateCSV,
    handleDownloadEditTemplateCSV,
    handleUploadCSV,
  } = eventCsv;

  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventResponseDto | null>(
    null,
  );
  const [deletingEvent, setDeletingEvent] = useState<EventResponseDto | null>(
    null,
  );
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
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
    !!searchParams.id ||
    !!searchParams.search ||
    !!searchParams.eventMasterId ||
    !!searchParams.locationId ||
    !!searchParams.interviewerId ||
    !!searchParams.startTimeFrom;

  const handleCreateSubmit = async (data: EventFormData) => {
    await handleCreate(data);
    setIsCreating(false);
    await refetch();
  };

  const handleUpdateSubmit = async (id: string, data: EventFormData) => {
    await handleUpdate(id, data);
    setEditingEvent(null);
    await refetch();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEvent) return;
    setIsDeleting(true);
    try {
      await handleDelete(deletingEvent.id);
      await refetch();
    } catch {
      // エラーはhandleDelete内でトースト表示済み
    } finally {
      setDeletingEvent(null);
      setIsDeleting(false);
    }
  };

  const handleRowClick = (row: EventResponseDto) => {
    const queryString = urlSearchParams.toString();
    const url = queryString
      ? `/admin/event-management/${row.id}?${queryString}`
      : `/admin/event-management/${row.id}`;
    router.push(url);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <EventManagementHeader
          onBulkClick={() => setIsBulkDialogOpen(true)}
          onCreateClick={() => setIsCreating(true)}
        />
        <Loading />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <EventManagementHeader
        onBulkClick={() => setIsBulkDialogOpen(true)}
        onCreateClick={() => setIsCreating(true)}
      />

      <EventManagementContent
        events={events}
        searchFormData={searchParams}
        onSearch={handleSearch}
        onReset={handleReset}
        onRowClick={handleRowClick}
        onEditClick={setEditingEvent}
        onDeleteClick={setDeletingEvent}
        onExportCSV={async () => {
          try {
            await handleExportCSV();
          } catch (err) {
            setError(
              err instanceof Error ? err.message : 'CSV出力に失敗しました',
            );
          }
        }}
        error={error}
        hasSearchConditions={hasSearchConditions}
        onSaveConditionClick={() => setIsSaveConditionDialogOpen(true)}
        onSearchConditionListClick={() =>
          setIsSearchConditionListDialogOpen(true)
        }
      />

      <CreateEventDialog
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSubmit={handleCreateSubmit}
      />

      <EditEventDialog
        isOpen={!!editingEvent}
        event={editingEvent}
        onClose={() => setEditingEvent(null)}
        onSubmit={handleUpdateSubmit}
      />

      <DeleteDialog
        isOpen={!!deletingEvent}
        onClose={() => setDeletingEvent(null)}
        onConfirm={handleDeleteConfirm}
        title="イベント削除"
        message="本当にこのイベントを削除しますか？"
        details={
          deletingEvent ? (
            <>
              <p className="text-sm text-gray-600">
                イベントマスター: {deletingEvent.eventMasterName}
              </p>
              <p className="text-sm text-gray-600">
                開始時刻:{' '}
                {new Date(deletingEvent.startTime).toLocaleString('ja-JP')}
              </p>
            </>
          ) : null
        }
        isSubmitting={isDeleting}
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
