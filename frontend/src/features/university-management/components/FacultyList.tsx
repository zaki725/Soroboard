'use client';

import { Button, Table, EditIcon, TrashIcon } from '@/components/ui';
import type { FacultyResponseDto } from '@/types/faculty';

type FacultyListProps = {
  faculties: FacultyResponseDto[];
  onEdit: (faculty: FacultyResponseDto) => void;
  onDelete: (faculty: FacultyResponseDto) => void;
};

export const FacultyList = ({
  faculties,
  onEdit,
  onDelete,
}: FacultyListProps) => {
  const columns = [
    { key: 'name', label: '学部名' },
    {
      key: 'deviationValue',
      label: '偏差値',
      render: (_value: unknown, row: FacultyResponseDto) => (
        <div className="space-y-1">
          {row.deviationValue ? (
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              {row.deviationValue.value}
            </span>
          ) : (
            <span className="text-gray-400 text-sm">未登録</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: '操作',
      render: (_value: unknown, row: FacultyResponseDto) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(row)}>
            <div className="flex items-center gap-1">
              <EditIcon />
              <span>編集</span>
            </div>
          </Button>
          <Button size="sm" variant="danger" onClick={() => onDelete(row)}>
            <div className="flex items-center gap-1">
              <TrashIcon />
              <span>削除</span>
            </div>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={faculties}
      emptyMessage="学部が登録されていません"
    />
  );
};
