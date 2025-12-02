import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSWRData } from '@/libs/swr-client';
import { buildSWRKey } from '@/libs/swr-utils';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import { isValidInterviewerCategory } from '@/libs/type-guards';
import type {
  InterviewerListResponseDto,
  InterviewerCategory,
} from '@/types/interviewer';

type InterviewerSearchFormData = {
  userId: string;
  search: string;
  category: InterviewerCategory | '';
};

export const useInterviewerList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URLパラメータから検索条件を取得（型ガードで安全性を確保）
  const getSearchParamsFromUrl = useCallback((): InterviewerSearchFormData => {
    const categoryParam = searchParams.get('category');

    return {
      userId: searchParams.get('userId') || '',
      search: searchParams.get('search') || '',
      category: isValidInterviewerCategory(categoryParam) ? categoryParam : '',
    };
  }, [searchParams]);

  const searchKey = useMemo(() => {
    const params = getSearchParamsFromUrl();
    return buildSWRKey('/interviewers', {
      userId: params.userId,
      search: params.search,
      category: params.category,
    });
  }, [getSearchParamsFromUrl]);

  // 手動で設定するエラー（CSVエクスポートなど、SWRを使わない操作のエラー）
  const [manualError, setManualError] = useState<string | null>(null);

  // SWRでデータ取得（共通のuseSWRDataを使用）
  const {
    data,
    error: swrError,
    isLoading,
    mutate,
  } = useSWRData<InterviewerListResponseDto>(searchKey);

  // エラーメッセージを取得（SWRのエラーと手動で設定したエラーを統合）
  const error = useMemo(() => {
    if (manualError) return manualError;
    if (!swrError) return null;
    return extractErrorMessage(
      swrError,
      errorMessages.interviewerListFetchFailed,
    );
  }, [swrError, manualError]);

  // fetchInterviewersの代わりにmutateを返す（後方互換性のため）
  const fetchInterviewers = useCallback(async () => {
    await mutate();
  }, [mutate]);

  const updateUrlParams = useCallback(
    (params: InterviewerSearchFormData) => {
      const urlParams = new URLSearchParams();

      // 値がある場合のみパラメータに追加
      const paramMap: Record<string, string> = {
        userId: params.userId,
        search: params.search,
        category: params.category,
      };

      for (const [key, value] of Object.entries(paramMap)) {
        if (value) {
          urlParams.set(key, value);
        }
      }

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
    interviewers: data?.interviewers || [],
    isLoading,
    error,
    setError: setManualError, // 手動でエラーを設定（CSVエクスポートなど）
    searchParams: currentSearchParams,
    handleSearch,
    handleReset,
    fetchInterviewers,
    mutate, // SWRのmutateも公開（必要に応じて使用可能）
  };
};
