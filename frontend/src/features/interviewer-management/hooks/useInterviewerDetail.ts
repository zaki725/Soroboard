import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import type { InterviewerResponseDto } from '@/types/interviewer';

export const useInterviewerDetail = ({
  interviewerId,
}: {
  interviewerId: string;
}) => {
  const [interviewer, setInterviewer] = useState<InterviewerResponseDto | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInterviewer = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient<InterviewerResponseDto>(
        `/interviewers/${interviewerId}`,
      );
      setInterviewer(data);
    } catch (err) {
      const message = extractErrorMessage(
        err,
        '面接官データの取得に失敗しました',
      );
      setError(message);
      setInterviewer(null);
    } finally {
      setIsLoading(false);
    }
  }, [interviewerId]);

  useEffect(() => {
    void fetchInterviewer();
  }, [fetchInterviewer]);

  return {
    interviewer,
    isLoading,
    error,
    setError,
    fetchInterviewer,
  };
};
