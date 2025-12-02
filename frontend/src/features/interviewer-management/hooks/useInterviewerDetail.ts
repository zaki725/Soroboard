import { useMemo } from 'react';
import { useSWRData } from '@/libs/swr-client';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import type { InterviewerResponseDto } from '@/types/interviewer';

export const useInterviewerDetail = ({
  interviewerId,
}: {
  interviewerId: string;
}) => {
  // SWRでデータ取得（画面描画なのでSWRを使用）
  const {
    data: interviewer,
    error: swrError,
    isLoading,
    mutate,
  } = useSWRData<InterviewerResponseDto>(
    interviewerId ? `/interviewers/${interviewerId}` : null,
  );

  // エラーメッセージを取得
  const error = useMemo(() => {
    if (!swrError) return null;
    return extractErrorMessage(
      swrError,
      errorMessages.interviewerDetailFetchFailed,
    );
  }, [swrError]);

  // fetchInterviewerの代わりにmutateを返す（後方互換性のため）
  const fetchInterviewer = async () => {
    await mutate();
  };

  return {
    interviewer: interviewer || null,
    isLoading,
    error,
    setError: () => {}, // SWRがエラーを管理するため不要
    fetchInterviewer,
    mutate, // SWRのmutateも公開（必要に応じて使用可能）
  };
};
