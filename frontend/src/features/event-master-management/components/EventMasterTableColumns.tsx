'use client';

import type { TableColumn } from '@/components/ui/Table';
import type { EventMasterResponseDto } from '@/types/event-master';

export const useEventMasterTableColumns =
  (): TableColumn<EventMasterResponseDto>[] => {
    return [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'イベント名' },
      {
        key: 'description',
        label: '説明',
        render: (value: unknown): React.ReactNode => {
          return (value as string) || '-';
        },
      },
      { key: 'type', label: 'タイプ' },
      {
        key: 'recruitYearId',
        label: '対象年度',
        render: (value: unknown): React.ReactNode => {
          return `${value}年度`;
        },
      },
    ];
  };
