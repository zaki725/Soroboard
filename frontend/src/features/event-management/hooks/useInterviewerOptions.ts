'use client';

import { useMemo } from 'react';
import { useSWRData } from '@/libs/swr-client';
import type { InterviewerListResponseDto } from '@/types/interviewer';
import type { SelectOption } from '@/components/ui';

export const useInterviewerOptions = () => {
  // SWRでデータ取得（画面描画なのでSWRを使用）
  const { data, isLoading } =
    useSWRData<InterviewerListResponseDto>('/interviewers');

  const interviewerOptions = useMemo<SelectOption[]>(() => {
    if (!data?.interviewers) return [];
    return data.interviewers.map((interviewer) => ({
      value: interviewer.userId,
      label: `${interviewer.userName} (${interviewer.userEmail})`,
    }));
  }, [data]);

  return {
    interviewerOptions,
    isLoading,
  };
};
