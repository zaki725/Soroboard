import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSWRData } from '@/libs/swr-client';
import { buildSWRKey } from '@/libs/swr-utils';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import type { StudentResponseDto } from '@/types/student';

export const useStudentList = () => {
  const searchParams = useSearchParams();

  // URLパラメータからschoolIdを取得
  const schoolId = searchParams.get('schoolId') || '';

  const searchKey = useMemo(() => {
    if (!schoolId) {
      return null; // schoolIdが指定されていない場合はデータ取得しない
    }
    return buildSWRKey('/students', {}, { schoolId });
  }, [schoolId]);

  // SWRでデータ取得（共通のuseSWRDataを使用）
  const {
    data: students,
    error: swrError,
    isLoading,
    mutate,
  } = useSWRData<StudentResponseDto[]>(searchKey);

  // エラーメッセージを取得
  const error = useMemo(() => {
    if (!swrError) return null;
    return extractErrorMessage(swrError, errorMessages.studentListFetchFailed);
  }, [swrError]);

  return {
    students: students || [],
    isLoading,
    error,
    mutate,
    schoolId,
  };
};
