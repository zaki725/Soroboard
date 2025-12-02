'use client';

import { Button, EditIcon, TrashIcon, ViewIcon } from '@/components/ui';
import type { EventResponseDto } from '@/types/event';

type EventTableActionsProps = {
  row: EventResponseDto;
  onDetailClick: (row: EventResponseDto) => void;
  onEditClick: (row: EventResponseDto) => void;
  onDeleteClick: (row: EventResponseDto) => void;
};

export const EventTableActions = ({
  row,
  onDetailClick,
  onEditClick,
  onDeleteClick,
}: EventTableActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          onDetailClick(row);
        }}
        icon={<ViewIcon />}
      >
        詳細
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          onEditClick(row);
        }}
        icon={<EditIcon />}
      >
        編集
      </Button>
      <Button
        size="sm"
        variant="danger"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteClick(row);
        }}
        icon={<TrashIcon />}
      >
        削除
      </Button>
    </div>
  );
};
