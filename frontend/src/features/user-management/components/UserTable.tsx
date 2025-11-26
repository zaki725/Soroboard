'use client';

import Link from 'next/link';
import { Table, Button, EditIcon } from '@/components/ui';
import { roleLabelMap } from '../constants/user.constants';
import type { UserResponseDto } from '@/types/user';

type UserTableProps = {
  users: UserResponseDto[];
  total: number;
  page: number;
  onPageChange: (page: number) => void;
  onRowClick: (userId: string) => void;
};

export const UserTable = ({
  users,
  total,
  page,
  onPageChange,
  onRowClick,
}: UserTableProps) => {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'email', label: 'メールアドレス' },
    {
      key: 'name',
      label: '名前',
      render: (
        _value: unknown,
        row: {
          id: string;
          isInterviewerBool: boolean;
          name: string;
        },
      ) => {
        if (row.isInterviewerBool) {
          return (
            <Link
              href={`/admin/interviewer-management/${row.id}`}
              className="text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {row.name}
            </Link>
          );
        }
        return row.name;
      },
    },
    { key: 'role', label: '権限' },
    { key: 'departmentName', label: '部署' },
    {
      key: 'isInterviewer',
      label: '面接官',
      render: (value: unknown) => {
        if (value === '○') {
          return (
            <span className="inline-flex items-center justify-center w-8 h-8 text-lg font-bold text-blue-600 bg-blue-50 rounded-full">
              ✓
            </span>
          );
        }
        return <span className="text-gray-400">-</span>;
      },
    },
    {
      key: 'actions',
      label: '操作',
      render: (_value: unknown, row: { id: string }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRowClick(row.id);
          }}
          icon={<EditIcon />}
        >
          編集
        </Button>
      ),
    },
  ];

  const data = users.map((user) => ({
    id: user.id,
    email: user.email,
    name: `${user.lastName} ${user.firstName}`,
    role: roleLabelMap[user.role],
    departmentName: user.departmentName || '-',
    isInterviewer: user.isInterviewer ? '○' : '-',
    isInterviewerBool: user.isInterviewer,
  }));

  return (
    <Table
      columns={columns}
      data={data}
      emptyMessage="ユーザーが見つかりません"
      onRowClick={(row) => onRowClick(row.id)}
      pagination={{
        page,
        total,
        onPageChange,
      }}
    />
  );
};
