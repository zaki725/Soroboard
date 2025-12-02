'use client';

import { Table, CsvExportButton, Button, BookmarkIcon } from '@/components/ui';
import { SaveSearchConditionButton } from '@/components/features';
import { EventSearchForm } from './EventSearchForm';
import { EventTableActions } from './EventTableActions';
import { useEventTableColumns } from './EventTableColumns';
import type { EventResponseDto } from '@/types/event';
import type { EventSearchFormData } from '../../hooks/list/useEventList';
import { useSearchParams } from 'next/navigation';

type EventManagementContentProps = {
  events: EventResponseDto[];
  searchFormData: EventSearchFormData;
  onSearch: (data: EventSearchFormData) => void;
  onReset: () => void;
  onRowClick: (row: EventResponseDto) => void;
  onEditClick: (row: EventResponseDto) => void;
  onDeleteClick: (row: EventResponseDto) => void;
  onExportCSV: () => Promise<void>;
  error: string | null;
  hasSearchConditions: boolean;
  onSaveConditionClick: () => void;
  onSearchConditionListClick: () => void;
};

export const EventManagementContent = ({
  events,
  searchFormData,
  onSearch,
  onReset,
  onRowClick,
  onEditClick,
  onDeleteClick,
  onExportCSV,
  error,
  hasSearchConditions,
  onSaveConditionClick,
  onSearchConditionListClick,
}: EventManagementContentProps) => {
  const urlSearchParams = useSearchParams();
  const columns = useEventTableColumns({ searchParams: urlSearchParams });

  const tableColumns = [
    ...columns,
    {
      key: 'actions',
      label: '操作',
      render: (_value: unknown, row: EventResponseDto) => (
        <EventTableActions
          row={row}
          onDetailClick={onRowClick}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6 mt-6">
      <EventSearchForm
        searchParams={searchFormData}
        onSearch={onSearch}
        onReset={onReset}
      />

      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex gap-2 items-center flex-wrap">
          <SaveSearchConditionButton
            onClick={onSaveConditionClick}
            disabled={!hasSearchConditions}
          />
          <Button
            variant="outline"
            onClick={onSearchConditionListClick}
            icon={<BookmarkIcon />}
          >
            検索条件一覧
          </Button>
        </div>
        <div className="flex gap-2">
          <CsvExportButton onExport={onExportCSV} variant="outline">
            CSV出力
          </CsvExportButton>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Table
        columns={tableColumns}
        data={events}
        emptyMessage="イベントデータがありません"
        onRowClick={onRowClick}
      />
    </div>
  );
};
