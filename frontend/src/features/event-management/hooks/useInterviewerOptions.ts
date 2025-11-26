'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/libs/api-client';
import type { InterviewerListResponseDto } from '@/types/interviewer';
import type { SelectOption } from '@/components/ui';

export const useInterviewerOptions = () => {
  const [interviewerOptions, setInterviewerOptions] = useState<SelectOption[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchInterviewers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiClient<InterviewerListResponseDto>('/interviewers');
      const options: SelectOption[] = data.interviewers.map((interviewer) => ({
        value: interviewer.userId,
        label: `${interviewer.userName} (${interviewer.userEmail})`,
      }));
      setInterviewerOptions(options);
    } catch (err) {
      console.error('面接官データの取得に失敗しました', err);
      setInterviewerOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchInterviewers();
  }, [fetchInterviewers]);

  return {
    interviewerOptions,
    isLoading,
  };
};
