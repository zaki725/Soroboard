'use client';

import { Loading, PageContainer, Title } from '@/components/ui';
import { FormError } from '@/components/form';
import { MissingSchoolIdNotice } from '@/components/features';
import { useStudentDetail } from '../hooks/useStudentDetail';
import { statusLabelMap } from '../constants/student.constants';
import { formatDateToISOString } from '@/libs/date-utils';

type Props = {
  studentId: string;
  schoolId: string;
};

export const StudentDetail = ({ studentId, schoolId }: Props) => {
  const { student, isLoading, error } = useStudentDetail(studentId, schoolId);

  if (!schoolId) {
    return (
      <PageContainer>
        <Title>生徒詳細</Title>
        <MissingSchoolIdNotice />
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <Title>生徒詳細</Title>
        <Loading />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Title>生徒詳細</Title>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6 mt-6">
        <FormError error={error} />

        {student && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                生徒ID
              </div>
              <p className="text-sm text-gray-900">{student.id}</p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                生徒番号
              </div>
              <p className="text-sm text-gray-900">{student.studentNo ?? '-'}</p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                氏名
              </div>
              <p className="text-sm text-gray-900">
                {student.lastName} {student.firstName}
              </p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                ステータス
              </div>
              <p className="text-sm text-gray-900">
                {statusLabelMap[student.status] ?? student.status}
              </p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                生年月日
              </div>
              <p className="text-sm text-gray-900">
                {student.birthDate ? formatDateToISOString(student.birthDate) : '-'}
              </p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                入塾日
              </div>
              <p className="text-sm text-gray-900">
                {student.joinedAt ? formatDateToISOString(student.joinedAt) : '-'}
              </p>
            </div>

            <div className="col-span-2">
              <div className="block text-sm font-medium text-gray-700 mb-1">
                メモ
              </div>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {student.note ?? '-'}
              </p>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
