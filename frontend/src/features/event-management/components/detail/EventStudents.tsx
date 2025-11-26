'use client';

import { Table } from '@/components/ui';

export const EventStudents = () => {
  // 静的データ: 参加学生一覧
  const studentList = [
    { id: '1', name: '学生A', email: 'student-a@example.com', status: '参加' },
    { id: '2', name: '学生B', email: 'student-b@example.com', status: '参加' },
    {
      id: '3',
      name: '学生C',
      email: 'student-c@example.com',
      status: 'キャンセル',
    },
  ];

  const studentColumns = [
    { key: 'name', label: '名前' },
    { key: 'email', label: 'メールアドレス' },
    { key: 'status', label: 'ステータス' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">参加学生一覧</h2>
      <Table
        columns={studentColumns}
        data={studentList}
        emptyMessage="参加学生がありません"
      />
    </div>
  );
};
