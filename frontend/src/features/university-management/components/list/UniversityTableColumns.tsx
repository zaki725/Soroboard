import Link from 'next/link';
import { Button, TrashIcon, EditIcon, ViewIcon } from '@/components/ui';
import type { UniversityResponseDto } from '@/types/university';

type ColumnProps = {
  startEdit: (university: UniversityResponseDto) => void;
  startDelete: (university: UniversityResponseDto) => void;
};

export const getTableColumns = ({ startEdit, startDelete }: ColumnProps) => {
  return [
    { key: 'id', label: 'ID' },
    {
      key: 'name',
      label: '大学名',
      render: (_value: unknown, row: UniversityResponseDto) => (
        <Link
          href={`/admin/university-management/${row.id}`}
          className="text-blue-600 hover:underline"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: 'rank',
      label: '学校ランク',
      render: (_value: unknown, row: UniversityResponseDto) =>
        row.rank ? (
          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
            {row.rank}
          </span>
        ) : (
          <span className="text-gray-400 text-sm">未設定</span>
        ),
    },
    {
      key: 'actions',
      label: '操作',
      render: (_value: unknown, row: UniversityResponseDto) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/university-management/${row.id}`}>
            <Button size="sm" variant="outline" icon={<ViewIcon />}>
              詳細
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            onClick={() => startEdit(row)}
            icon={<EditIcon />}
          >
            編集
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => startDelete(row)}
            icon={<TrashIcon />}
          >
            削除
          </Button>
        </div>
      ),
    },
  ];
};
