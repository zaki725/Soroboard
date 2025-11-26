'use client';

import { Title } from '@/components/ui';
import { Button, PlusIcon, BulkIcon } from '@/components/ui';

type EventManagementHeaderProps = {
  onBulkClick: () => void;
  onCreateClick: () => void;
};

export const EventManagementHeader = ({
  onBulkClick,
  onCreateClick,
}: EventManagementHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <Title>イベント管理</Title>
      <div className="flex gap-2">
        <Button
          variant="primary"
          onClick={onBulkClick}
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-md"
          icon={<BulkIcon />}
        >
          一括処理
        </Button>
        <Button variant="primary" onClick={onCreateClick} icon={<PlusIcon />}>
          新規登録
        </Button>
      </div>
    </div>
  );
};
