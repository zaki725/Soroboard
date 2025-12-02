import Link from 'next/link';
import { Button, TrashIcon, EditIcon, ViewIcon } from '@/components/ui';
import type { InterviewerResponseDto } from '@/types/interviewer';

type ColumnProps = {
  startEdit: (userId: string) => void;
  startDelete: (userId: string) => void;
  handleRowClick: (row: { userId: string }) => void;
  searchParams: {
    userId?: string;
    search?: string;
  };
};

export const getTableColumns = ({
  startEdit,
  startDelete,
  handleRowClick,
  searchParams,
}: ColumnProps) => {
  const getDetailUrl = (userId: string) => {
    const params = new URLSearchParams();
    if (searchParams.userId) params.set('userId', searchParams.userId);
    if (searchParams.search) params.set('search', searchParams.search);
    const queryString = params.toString();
    const baseUrl = `/admin/interviewer-management/${userId}`;
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  return [
    { key: 'userId', label: 'ユーザーID' },
    {
      key: 'userName',
      label: '名前',
      render: (_value: unknown, row: InterviewerResponseDto) => (
        <Link
          href={getDetailUrl(row.userId)}
          className="text-blue-600 hover:text-blue-800 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {row.userName}
        </Link>
      ),
    },
    { key: 'userEmail', label: 'メールアドレス' },
    { key: 'category', label: 'カテゴリ' },
    {
      key: 'actions',
      label: '操作',
      render: (_value: unknown, row: InterviewerResponseDto) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick({ userId: row.userId });
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
              startEdit(row.userId);
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
              startDelete(row.userId);
            }}
            icon={<TrashIcon />}
          >
            削除
          </Button>
        </div>
      ),
    },
  ];
};
