import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import type { InterviewerListResponseDto } from '@/types/interviewer';

import type { InterviewerCategory } from '@/types/interviewer';

type InterviewerSearchFormData = {
  userId: string;
  search: string;
  category: InterviewerCategory | '';
};

export const useInterviewerList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [interviewers, setInterviewers] = useState<
    InterviewerListResponseDto['interviewers']
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URLパラメータから検索条件を取得
  const getSearchParamsFromUrl = useCallback((): InterviewerSearchFormData => {
    return {
      userId: searchParams.get('userId') || '',
      search: searchParams.get('search') || '',
      category:
        (searchParams.get('category') as InterviewerCategory | null) || '',
    };
  }, [searchParams]);

  const fetchInterviewers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = getSearchParamsFromUrl();
      const apiParams = new URLSearchParams();

      if (params.userId) {
        apiParams.append('userId', params.userId);
      }
      if (params.search) {
        apiParams.append('search', params.search);
      }
      if (params.category) {
        apiParams.append('category', params.category);
      }

      const queryString = apiParams.toString();
      const url = queryString
        ? `/interviewers?${queryString}`
        : '/interviewers';

      const data = await apiClient<InterviewerListResponseDto>(url);
      setInterviewers(data.interviewers);
    } catch (err) {
      const message = extractErrorMessage(
        err,
        '面接官データの取得に失敗しました',
      );
      setError(message);
      setInterviewers([]);
    } finally {
      setIsLoading(false);
    }
  }, [getSearchParamsFromUrl]);

  useEffect(() => {
    void fetchInterviewers();
  }, [fetchInterviewers]);

  const updateUrlParams = useCallback(
    (params: InterviewerSearchFormData) => {
      const urlParams = new URLSearchParams();
      if (params.userId) urlParams.set('userId', params.userId);
      if (params.search) urlParams.set('search', params.search);
      if (params.category) urlParams.set('category', params.category);

      const queryString = urlParams.toString();
      const url = queryString
        ? `/admin/interviewer-management?${queryString}`
        : '/admin/interviewer-management';
      router.push(url);
    },
    [router],
  );

  const handleSearch = (data: InterviewerSearchFormData) => {
    // URLのみを変更し、状態はURLパラメータの変更検知から更新させる
    updateUrlParams(data);
  };

  const handleReset = () => {
    // URLのみを変更し、状態はURLパラメータの変更検知から更新させる
    router.push('/admin/interviewer-management');
  };

  const currentSearchParams = getSearchParamsFromUrl();

  return {
    interviewers,
    isLoading,
    error,
    setError,
    searchParams: currentSearchParams,
    handleSearch,
    handleReset,
    fetchInterviewers,
  };
};
