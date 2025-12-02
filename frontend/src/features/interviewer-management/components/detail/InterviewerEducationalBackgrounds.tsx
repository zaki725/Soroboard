'use client';

import {
  Button,
  Loading,
  Table,
  PlusIcon,
  EditIcon,
  TrashIcon,
} from '@/components/ui';
import { FormError } from '@/components/form';
import type { EducationalBackgroundResponseDto } from '@/types/educational-background';

type InterviewerEducationalBackgroundsProps = {
  educationalBackgrounds: EducationalBackgroundResponseDto[];
  isLoading: boolean;
  error: string | null;
  onAdd: () => void;
  onEdit: (educationalBackground: EducationalBackgroundResponseDto) => void;
  onDelete: (educationalBackground: EducationalBackgroundResponseDto) => void;
};

export const InterviewerEducationalBackgrounds = ({
  educationalBackgrounds,
  isLoading,
  error,
  onAdd,
  onEdit,
  onDelete,
}: InterviewerEducationalBackgroundsProps) => {
  const columns = [
    { key: 'educationType', label: '教育タイプ' },
    {
      key: 'university',
      label: '大学・学部',
      render: (_value: unknown, row: EducationalBackgroundResponseDto) => {
        const parts = [row.universityName, row.facultyName].filter(Boolean);
        return parts.length > 0 ? (
          parts.join(' ')
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      key: 'graduation',
      label: '卒業年月',
      render: (_value: unknown, row: EducationalBackgroundResponseDto) => {
        if (row.graduationYear && row.graduationMonth) {
          return `${row.graduationYear}年${row.graduationMonth}月`;
        }
        if (row.graduationYear) {
          return `${row.graduationYear}年`;
        }
        return <span className="text-gray-400">-</span>;
      },
    },
    {
      key: 'actions',
      label: '操作',
      render: (_value: unknown, row: EducationalBackgroundResponseDto) => (
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">学歴一覧</h2>
        <Button variant="primary" onClick={onAdd}>
          <div className="flex items-center gap-2">
            <PlusIcon />
            <span>学歴を追加</span>
          </div>
        </Button>
      </div>

      <FormError error={error} />

      {isLoading ? (
        <Loading />
      ) : (
        <Table
          columns={columns}
          data={educationalBackgrounds}
          emptyMessage="学歴が登録されていません"
        />
      )}
    </div>
  );
};
