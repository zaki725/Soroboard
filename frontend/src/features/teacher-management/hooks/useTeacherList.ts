import { useMemo } from 'react';
import { useSWRData } from '@/libs/swr-client';
import { buildSWRKey } from '@/libs/swr-utils';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import type { TeacherResponseDto } from '@/types/teacher';

export const useTeacherList = () => {
  const searchKey = useMemo(() => buildSWRKey('/teachers'), []);

  const {
    data: teachers,
    error: swrError,
    isLoading,
    mutate,
  } = useSWRData<TeacherResponseDto[]>(searchKey);

  const error = useMemo(() => {
    if (!swrError) return null;
    return extractErrorMessage(swrError, errorMessages.teacherListFetchFailed);
  }, [swrError]);

  return {
    teachers: teachers || [],
    isLoading,
    error,
    mutate,
  };
};
