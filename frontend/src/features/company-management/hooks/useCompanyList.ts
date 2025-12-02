import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRecruitYear } from '@/contexts/RecruitYearContext';
import { useSWRData } from '@/libs/swr-client';
import { buildSWRKey } from '@/libs/swr-utils';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import type { CompanyResponseDto } from '@/types/company';

type CompanySearchFormData = {
  id: string;
  search: string;
};

export const useCompanyList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedRecruitYear } = useRecruitYear();

  // URLパラメータから検索条件を取得
  const getSearchParamsFromUrl = useCallback((): CompanySearchFormData => {
    return {
      id: searchParams.get('id') || '',
      search: searchParams.get('search') || '',
    };
  }, [searchParams]);

  const searchKey = useMemo(() => {
    const recruitYearId = selectedRecruitYear?.recruitYear;
    if (!recruitYearId) {
      return null; // 年度が選択されていない場合はデータ取得しない
    }

    const params = getSearchParamsFromUrl();
    return buildSWRKey(
      '/companies',
      {
        id: params.id,
        search: params.search,
      },
      {
        recruitYearId,
      },
    );
  }, [selectedRecruitYear?.recruitYear, getSearchParamsFromUrl]);

  // 手動で設定するエラー（CSVエクスポートなど、SWRを使わない操作のエラー）
  const [manualError, setManualError] = useState<string | null>(null);

  // SWRでデータ取得（共通のuseSWRDataを使用）
  const {
    data: companies,
    error: swrError,
    isLoading,
    mutate,
  } = useSWRData<CompanyResponseDto[]>(searchKey);

  // エラーメッセージを取得（SWRのエラーと手動で設定したエラーを統合）
  const error = useMemo(() => {
    if (manualError) return manualError;
    if (!swrError) return null;
    return extractErrorMessage(swrError, errorMessages.companyListFetchFailed);
  }, [swrError, manualError]);

  // fetchCompaniesの代わりにmutateを返す（後方互換性のため）
  const fetchCompanies = useCallback(async () => {
    await mutate();
  }, [mutate]);

  const updateUrlParams = useCallback(
    (params: CompanySearchFormData) => {
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
        ? `/master/company-management?${queryString}`
        : '/master/company-management';
      router.push(url);
    },
    [router],
  );

  const handleSearch = (data: CompanySearchFormData) => {
    // URLのみを変更し、状態はURLパラメータの変更検知から更新させる
    updateUrlParams(data);
  };

  const handleReset = () => {
    // URLのみを変更し、状態はURLパラメータの変更検知から更新させる
    router.push('/master/company-management');
  };

  const currentSearchParams = getSearchParamsFromUrl();

  return {
    companies: companies || [],
    isLoading,
    error,
    setError: setManualError, // 手動でエラーを設定（CSVエクスポートなど）
    handleSearch,
    handleReset,
    searchParams: currentSearchParams,
    fetchCompanies,
    mutate, // SWRのmutateも公開（必要に応じて使用可能）
    selectedRecruitYearId: selectedRecruitYear?.recruitYear || 0,
  };
};
