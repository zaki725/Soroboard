import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSWRData } from '@/libs/swr-client';
import { buildSWRKey } from '@/libs/swr-utils';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import type { TeacherResponseDto } from '@/types/teacher';

export const useTeacherList = () => {
  const searchParams = useSearchParams();

  // URLパラメータからschoolIdを取得
  const schoolId = searchParams.get('schoolId') || '';

  const searchKey = useMemo(() => {
    if (!schoolId) {
      return null; // schoolIdが指定されていない場合はデータ取得しない
    }
    return buildSWRKey('/teachers', {}, { schoolId });
  }, [schoolId]);

  // SWRでデータ取得（共通のuseSWRDataを使用）
  const {
    data: teachers,
    error: swrError,
    isLoading,
    mutate,
  } = useSWRData<TeacherResponseDto[]>(searchKey);

  // エラーメッセージを取得
  const error = useMemo(() => {
    if (!swrError) return null;
    return extractErrorMessage(
      swrError,
      errorMessages.teacherListFetchFailed,
    );
  }, [swrError]);

  return {
    teachers: teachers || [],
    isLoading,
    error,
    mutate,
    schoolId,
  };
};

