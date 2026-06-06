import { useMemo } from 'react';
import { useSWRData } from '@/libs/swr-client';
import { buildSWRKey } from '@/libs/swr-utils';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import type { StudentResponseDto } from '@/types/student';

export const useStudentDetail = (studentId: string) => {
  const searchKey = useMemo(() => {
    if (!studentId) {
      return null;
    }
    return buildSWRKey(`/students/${studentId}`);
  }, [studentId]);

  const {
    data: student,
    error: swrError,
    isLoading,
    mutate,
  } = useSWRData<StudentResponseDto>(searchKey);

  const error = useMemo(() => {
    if (!swrError) return null;
    return extractErrorMessage(swrError, errorMessages.studentFetchFailed);
  }, [swrError]);

  return {
    student: student ?? null,
    isLoading,
    error,
    mutate,
  };
};
