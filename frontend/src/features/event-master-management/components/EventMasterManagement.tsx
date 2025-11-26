'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Loading,
  Title,
  Table,
  PageContainer,
  PlusIcon,
  TrashIcon,
  BulkIcon,
  CsvExportButton,
  BookmarkIcon,
  EditIcon,
} from '@/components/ui';
import { FormError } from '@/components/form';
import { SaveSearchConditionButton } from '@/components/features';
import { useEventMasterList } from '../hooks/useEventMasterList';
import {
  useEventMasterManagement,
  type EventMasterFormData,
} from '../hooks/useEventMasterManagement';
import { useEventMasterCsv } from '../hooks/useEventMasterCsv';
import { useSearchCondition } from '../hooks/useSearchCondition';
import { EventMasterSearchForm } from './EventMasterSearchForm';
import { useEventMasterTableColumns } from './EventMasterTableColumns';
import { CreateEventMasterDialog } from './CreateEventMasterDialog';
import { EditEventMasterDialog } from './EditEventMasterDialog';
import { DeleteEventMasterDialog } from './DeleteEventMasterDialog';
import { BulkOperationDialog } from '@/components/features/BulkOperationDialog';
import { SaveSearchConditionDialog } from '@/components/features/SaveSearchConditionDialog';
import { SearchConditionListDialog } from '@/components/features/SearchConditionListDialog';
import { errorMessages } from '@/constants/error-messages';
import type { EventMasterResponseDto } from '@/types/event-master';

export const EventMasterManagement = () => {
  const {
    eventMasters,
    isLoading,
    searchParams,
    handleSearch,
    handleReset,
    refetch,
  } = useEventMasterList();

  const { handleCreate, handleUpdate, handleDelete } =
    useEventMasterManagement();

  const eventMasterCsv = useEventMasterCsv({
    searchParams,
    refetch,
  });

  const {
    handleExportCSV,
    handleDownloadTemplateCSV,
    handleDownloadEditTemplateCSV,
    handleUploadCSV,
  } = eventMasterCsv;

  const [isCreating, setIsCreating] = useState(false);
  const [editingEventMaster, setEditingEventMaster] =
    useState<EventMasterResponseDto | null>(null);
  const [deletingEventMaster, setDeletingEventMaster] =
    useState<EventMasterResponseDto | null>(null);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    !!searchParams.id || !!searchParams.search || !!searchParams.type;

  const columns = useEventMasterTableColumns();

  const handleCreateSubmit = async (data: EventMasterFormData) => {
    await handleCreate(data);
    setIsCreating(false);
    await refetch();
  };

  const handleUpdateSubmit = async (id: string, data: EventMasterFormData) => {
    await handleUpdate(id, data);
    setEditingEventMaster(null);
    await refetch();
  };

  const handleDeleteConfirm = async (id: string) => {
    await handleDelete(id);
    setDeletingEventMaster(null);
    await refetch();
  };

  if (isLoading) {
    return (
      <PageContainer>
        <Title>イベントマスター管理</Title>
        <Loading />
      </PageContainer>
    );
  }

  const tableColumns = [
    ...columns,
    {
      key: 'actions',
      label: '操作',
      render: (_value: unknown, row: EventMasterResponseDto) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditingEventMaster(row)}
            icon={<EditIcon />}
          >
            編集
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => setDeletingEventMaster(row)}
            icon={<TrashIcon />}
          >
            削除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="flex justify-between items-center">
        <Title>イベントマスター管理</Title>
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
        <EventMasterSearchForm
          defaultValues={searchParams}
          onSubmit={handleSearch}
          onReset={handleReset}
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
          columns={tableColumns}
          data={eventMasters}
          emptyMessage="イベントマスターデータがありません"
        />
      </div>

      <CreateEventMasterDialog
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSubmit={handleCreateSubmit}
      />

      <EditEventMasterDialog
        isOpen={!!editingEventMaster}
        eventMaster={editingEventMaster}
        onClose={() => setEditingEventMaster(null)}
        onSubmit={handleUpdateSubmit}
      />

      <DeleteEventMasterDialog
        isOpen={!!deletingEventMaster}
        eventMaster={deletingEventMaster}
        onClose={() => setDeletingEventMaster(null)}
        onConfirm={handleDeleteConfirm}
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
