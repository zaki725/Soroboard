'use client';

import Link from 'next/link';
import type { TableColumn } from '@/components/ui/Table';
import type { EventResponseDto } from '@/types/event';
import { formatDateToJST } from '@/libs/date-utils';

type EventTableColumnsProps = {
  searchParams: URLSearchParams;
};

export const useEventTableColumns = ({
  searchParams,
}: EventTableColumnsProps): TableColumn<EventResponseDto>[] => {
  const getDetailUrl = (eventId: string) => {
    const queryString = searchParams.toString();
    const baseUrl = `/admin/event-management/${eventId}`;
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  return [
    { key: 'id', label: 'ID' },
    {
      key: 'eventMasterName',
      label: 'イベント名',
      render: (_value: unknown, row: EventResponseDto) => (
        <Link
          href={getDetailUrl(row.id)}
          className="text-blue-600 hover:text-blue-800 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {row.eventMasterName}
        </Link>
      ),
    },
    {
      key: 'startTime',
      label: '開始時刻',
      render: (value: unknown): React.ReactNode => {
        if (!value) return '-';
        return formatDateToJST(value as string);
      },
    },
    {
      key: 'endTime',
      label: '終了時刻',
      render: (value: unknown): React.ReactNode => {
        if (!value) return '-';
        return formatDateToJST(value as string);
      },
    },
    { key: 'locationName', label: 'ロケーション' },
  ];
};
