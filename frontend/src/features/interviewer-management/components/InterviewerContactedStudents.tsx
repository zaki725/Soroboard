'use client';

import { Table } from '@/components/ui';

type ContactedStudent = {
  id: string;
  name: string;
  university: string;
  lastContactDate: string;
  contactCount: number;
  status: string;
};

type InterviewerContactedStudentsProps = {
  contactedStudents: ContactedStudent[];
};

export const InterviewerContactedStudents = ({
  contactedStudents,
}: InterviewerContactedStudentsProps) => {
  const columns = [
    { key: 'name', label: '名前' },
    { key: 'university', label: '大学' },
    { key: 'lastContactDate', label: '最終接触日' },
    { key: 'contactCount', label: '接触回数' },
    {
      key: 'status',
      label: 'ステータス',
      render: (_value: unknown, row: ContactedStudent) => {
        const statusLabelMap: Record<string, string> = {
          applied: '応募済み',
          screening: '選考中',
          interview: '面接中',
          offer: '内定',
          rejected: '不採用',
        };
        return <span>{statusLabelMap[row.status] || row.status}</span>;
      },
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">接触したことのある学生一覧</h2>
      <Table
        columns={columns}
        data={contactedStudents}
        emptyMessage="接触した学生はいません"
      />
    </div>
  );
};
