import { useMemo } from 'react';
import { useSWRData } from '@/libs/swr-client';
import { buildSWRKey } from '@/libs/swr-utils';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import type { StudentResponseDto } from '@/types/student';

export const useStudentList = () => {
  const searchKey = useMemo(() => buildSWRKey('/students'), []);

  const {
    data: students,
    error: swrError,
    isLoading,
    mutate,
  } = useSWRData<StudentResponseDto[]>(searchKey);

  const error = useMemo(() => {
    if (!swrError) return null;
    return extractErrorMessage(swrError, errorMessages.studentListFetchFailed);
  }, [swrError]);

  return {
    students: students || [],
    isLoading,
    error,
    mutate,
  };
};
