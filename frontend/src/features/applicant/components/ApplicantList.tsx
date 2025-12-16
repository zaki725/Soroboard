'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  Title,
  PageContainer,
  Button,
  CsvExportButton,
} from '@/components/ui';
import { ApplicantSearchForm } from './ApplicantSearchForm';
import { formatDateToJST } from '@/libs/date-utils';

type ApplicantSearchFormData = {
  search: string;
  status: string;
  university: string;
};

const statusLabelMap: Record<string, string> = {
  applied: '応募済み',
  screening: '選考中',
  interview: '面接中',
  offer: '内定',
  rejected: '不採用',
};

const mockApplicants = [
  {
    id: '1',
    name: '山田 太郎',
    email: 'yamada@example.com',
    university: '東京大学',
    status: 'interview',
    appliedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: '佐藤 花子',
    email: 'sato@example.com',
    university: '京都大学',
    status: 'offer',
    appliedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '3',
    name: '鈴木 次郎',
    email: 'suzuki@example.com',
    university: '早稲田大学',
    status: 'screening',
    appliedAt: '2024-01-20T10:00:00Z',
  },
];

export const ApplicantList = () => {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<ApplicantSearchFormData>({
    search: '',
    status: '',
    university: '',
  });
  const [page, setPage] = useState(1);
  const total = mockApplicants.length;

  const handleSearch = (data: ApplicantSearchFormData) => {
    setSearchParams(data);
    setPage(1);
  };

  const handleReset = () => {
    setSearchParams({ search: '', status: '', university: '' });
    setPage(1);
  };

  const handleRowClick = (row: { id: string }) => {
    router.push(`/admin/applicants/${row.id}`);
  };

  const columns = [
    { key: 'name', label: '名前' },
    { key: 'email', label: 'メールアドレス' },
    { key: 'university', label: '大学' },
    {
      key: 'status',
      label: 'ステータス',
      render: (_value: unknown, row: { status: string }) => (
        <span>{statusLabelMap[row.status] || row.status}</span>
      ),
    },
    {
      key: 'appliedAt',
      label: '応募日時',
      render: (_value: unknown, row: { appliedAt: string }) => (
        <span>{formatDateToJST(row.appliedAt)}</span>
      ),
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
            handleRowClick(row);
          }}
        >
          詳細
        </Button>
      ),
    },
  ];

  const data = mockApplicants.map((applicant) => ({
    id: applicant.id,
    name: applicant.name,
    email: applicant.email,
    university: applicant.university,
    status: applicant.status,
    appliedAt: applicant.appliedAt,
  }));

  return (
    <PageContainer>
      <Title>応募者検索・一覧</Title>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <ApplicantSearchForm
          onSearch={handleSearch}
          onReset={handleReset}
          searchParams={searchParams}
        />

        <div className="flex justify-end gap-2">
          <CsvExportButton
            onExport={async () => {
              // 静的実装のため何もしない
            }}
            variant="outline"
          >
            CSV出力
          </CsvExportButton>
        </div>

        <Table
          columns={columns}
          data={data}
          emptyMessage="応募者が見つかりません"
          onRowClick={handleRowClick}
          pagination={{
            page,
            total,
            onPageChange: setPage,
          }}
        />
      </div>
    </PageContainer>
  );
};
