import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSWRData } from '@/libs/swr-client';
import { buildSWRKey } from '@/libs/swr-utils';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import { isValidUniversityRankLevel } from '@/libs/type-guards';
import type {
  UniversityResponseDto,
  UniversityRankLevel,
} from '@/types/university';

type UniversitySearchFormData = {
  id: string;
  search: string;
  rank: UniversityRankLevel | '';
};

export const useUniversityList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URLパラメータから検索条件を取得（型ガードで安全性を確保）
  const getSearchParamsFromUrl = useCallback((): UniversitySearchFormData => {
    const rankParam = searchParams.get('rank');

    return {
      id: searchParams.get('id') || '',
      search: searchParams.get('search') || '',
      rank: isValidUniversityRankLevel(rankParam) ? rankParam : '',
    };
  }, [searchParams]);

  const searchKey = useMemo(() => {
    const params = getSearchParamsFromUrl();
    return buildSWRKey('/universities', {
      id: params.id,
      search: params.search,
      rank: params.rank,
    });
  }, [getSearchParamsFromUrl]);

  // 手動で設定するエラー（CSVエクスポートなど、SWRを使わない操作のエラー）
  const [manualError, setManualError] = useState<string | null>(null);

  // SWRでデータ取得（共通のuseSWRDataを使用）
  const {
    data: universities,
    error: swrError,
    isLoading,
    mutate,
  } = useSWRData<UniversityResponseDto[]>(searchKey);

  // エラーメッセージを取得（SWRのエラーと手動で設定したエラーを統合）
  const error = useMemo(() => {
    if (manualError) return manualError;
    if (!swrError) return null;
    return extractErrorMessage(
      swrError,
      errorMessages.universityListFetchFailed,
    );
  }, [swrError, manualError]);

  // fetchUniversitiesの代わりにmutateを返す（後方互換性のため）
  const fetchUniversities = useCallback(async () => {
    await mutate();
  }, [mutate]);

  const updateUrlParams = useCallback(
    (params: UniversitySearchFormData) => {
      const urlParams = new URLSearchParams();

      // 値がある場合のみパラメータに追加
      const paramMap: Record<string, string> = {
        id: params.id,
        search: params.search,
        rank: params.rank,
      };

      for (const [key, value] of Object.entries(paramMap)) {
        if (value) {
          urlParams.set(key, value);
        }
      }

      const queryString = urlParams.toString();
      const url = queryString
        ? `/admin/university-management?${queryString}`
        : '/admin/university-management';
      router.push(url);
    },
    [router],
  );

  const handleSearch = (data: UniversitySearchFormData) => {
    // URLのみを変更し、状態はURLパラメータの変更検知から更新させる
    updateUrlParams(data);
  };

  const handleReset = () => {
    // URLのみを変更し、状態はURLパラメータの変更検知から更新させる
    router.push('/admin/university-management');
  };

  const currentSearchParams = getSearchParamsFromUrl();

  return {
    universities: universities || [],
    isLoading,
    error,
    setError: setManualError, // 手動でエラーを設定（CSVエクスポートなど）
    handleSearch,
    handleReset,
    searchParams: currentSearchParams,
    fetchUniversities,
    mutate, // SWRのmutateも公開（必要に応じて使用可能）
  };
};
