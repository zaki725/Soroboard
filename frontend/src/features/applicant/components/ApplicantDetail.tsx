'use client';

import { useRouter } from 'next/navigation';
import { Title, PageContainer, Button, EditIcon } from '@/components/ui';
import { formatDateToJST } from '@/libs/date-utils';

const statusLabelMap: Record<string, string> = {
  applied: '応募済み',
  screening: '選考中',
  interview: '面接中',
  offer: '内定',
  rejected: '不採用',
};

const mockApplicant = {
  id: '1',
  name: '山田 太郎',
  email: 'yamada@example.com',
  phone: '090-1234-5678',
  university: '東京大学',
  department: '工学部',
  grade: '4年生',
  status: 'interview',
  appliedAt: '2024-01-15T10:00:00Z',
  notes: '面接は2回実施済み。技術面接は良好。',
};

export const ApplicantDetail = ({}: { applicantId: string }) => {
  const router = useRouter();

  return (
    <PageContainer>
      <Title>応募者詳細</Title>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
              ID
            </div>
            <p className="text-sm text-gray-900">{mockApplicant.id}</p>
          </div>
          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
              名前
            </div>
            <p className="text-sm text-gray-900">{mockApplicant.name}</p>
          </div>
          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </div>
            <p className="text-sm text-gray-900">{mockApplicant.email}</p>
          </div>
          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
              電話番号
            </div>
            <p className="text-sm text-gray-900">{mockApplicant.phone}</p>
          </div>
          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
              大学
            </div>
            <p className="text-sm text-gray-900">{mockApplicant.university}</p>
          </div>
          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
              学部
            </div>
            <p className="text-sm text-gray-900">{mockApplicant.department}</p>
          </div>
          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
              学年
            </div>
            <p className="text-sm text-gray-900">{mockApplicant.grade}</p>
          </div>
          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
              ステータス
            </div>
            <p className="text-sm text-gray-900">
              {statusLabelMap[mockApplicant.status] || mockApplicant.status}
            </p>
          </div>
          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
              応募日時
            </div>
            <p className="text-sm text-gray-900">
              {formatDateToJST(mockApplicant.appliedAt)}
            </p>
          </div>
          <div className="col-span-2">
            <div className="block text-sm font-medium text-gray-700 mb-1">
              備考
            </div>
            <p className="text-sm text-gray-900">{mockApplicant.notes}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/applicants')}
          >
            一覧に戻る
          </Button>
          <Button variant="primary" icon={<EditIcon />}>
            編集
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};
