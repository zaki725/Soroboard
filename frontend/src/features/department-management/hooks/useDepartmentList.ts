import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSWRData } from '@/libs/swr-client';
import { buildSWRKey } from '@/libs/swr-utils';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import type { DepartmentResponseDto } from '@/types/department';

type DepartmentSearchFormData = {
  id: string;
  search: string;
};

export const useDepartmentList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URLパラメータから検索条件を取得
  const getSearchParamsFromUrl = useCallback((): DepartmentSearchFormData => {
    return {
      id: searchParams.get('id') || '',
      search: searchParams.get('search') || '',
    };
  }, [searchParams]);

  const searchKey = useMemo(() => {
    const params = getSearchParamsFromUrl();
    return buildSWRKey('/departments', {
      id: params.id,
      search: params.search,
    });
  }, [getSearchParamsFromUrl]);

  // 手動で設定するエラー（CSVエクスポートなど、SWRを使わない操作のエラー）
  const [manualError, setManualError] = useState<string | null>(null);

  // SWRでデータ取得（共通のuseSWRDataを使用）
  const {
    data: departments,
    error: swrError,
    isLoading,
    mutate,
  } = useSWRData<DepartmentResponseDto[]>(searchKey);

  // エラーメッセージを取得（SWRのエラーと手動で設定したエラーを統合）
  const error = useMemo(() => {
    if (manualError) return manualError;
    if (!swrError) return null;
    return extractErrorMessage(
      swrError,
      errorMessages.departmentListFetchFailed,
    );
  }, [swrError, manualError]);

  // fetchDepartmentsの代わりにmutateを返す（後方互換性のため）
  const fetchDepartments = useCallback(async () => {
    await mutate();
  }, [mutate]);

  const updateUrlParams = useCallback(
    (params: DepartmentSearchFormData) => {
      const urlParams = new URLSearchParams();

      // 値がある場合のみパラメータに追加
      const paramMap: Record<string, string> = {
        id: params.id,
        search: params.search,
      };

      for (const [key, value] of Object.entries(paramMap)) {
        if (value) {
          urlParams.set(key, value);
        }
      }

      const queryString = urlParams.toString();
      const url = queryString
        ? `/admin/department-management?${queryString}`
        : '/admin/department-management';
      router.push(url);
    },
    [router],
  );

  const handleSearch = (data: DepartmentSearchFormData) => {
    // URLのみを変更し、状態はURLパラメータの変更検知から更新させる
    updateUrlParams(data);
  };

  const handleReset = () => {
    // URLのみを変更し、状態はURLパラメータの変更検知から更新させる
    router.push('/admin/department-management');
  };

  const currentSearchParams = getSearchParamsFromUrl();

  return {
    departments: departments || [],
    isLoading,
    error,
    setError: setManualError, // 手動でエラーを設定（CSVエクスポートなど）
    handleSearch,
    handleReset,
    searchParams: currentSearchParams,
    fetchDepartments,
    mutate, // SWRのmutateも公開（必要に応じて使用可能）
  };
};
