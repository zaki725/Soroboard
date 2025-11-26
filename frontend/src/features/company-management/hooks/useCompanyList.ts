import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRecruitYear } from '@/contexts/RecruitYearContext';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import type { CompanyResponseDto } from '@/types/company';

type CompanySearchFormData = {
  id: string;
  search: string;
};

export const useCompanyList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedRecruitYear } = useRecruitYear();
  const [companies, setCompanies] = useState<CompanyResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URLパラメータから検索条件を取得
  const getSearchParamsFromUrl = useCallback((): CompanySearchFormData => {
    return {
      id: searchParams.get('id') || '',
      search: searchParams.get('search') || '',
    };
  }, [searchParams]);

  const fetchCompanies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const recruitYearId = selectedRecruitYear?.recruitYear;
      if (!recruitYearId) {
        setCompanies([]);
        return;
      }

      const params = getSearchParamsFromUrl();
      const apiParams = new URLSearchParams({
        recruitYearId: String(recruitYearId),
      });

      if (params.id) {
        apiParams.append('id', params.id);
      }
      if (params.search) {
        apiParams.append('search', params.search);
      }

      const data = await apiClient<CompanyResponseDto[]>(
        `/companies?${apiParams.toString()}`,
      );
      setCompanies(data);
    } catch (err) {
      const message = extractErrorMessage(
        err,
        '会社データの取得に失敗しました',
      );
      setError(message);
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRecruitYear?.recruitYear, getSearchParamsFromUrl]);

  useEffect(() => {
    void fetchCompanies();
  }, [fetchCompanies]);

  const updateUrlParams = useCallback(
    (params: CompanySearchFormData) => {
      const urlParams = new URLSearchParams();
      if (params.id) urlParams.set('id', params.id);
      if (params.search) urlParams.set('search', params.search);

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
    companies,
    isLoading,
    error,
    setError,
    handleSearch,
    handleReset,
    searchParams: currentSearchParams,
    fetchCompanies,
    selectedRecruitYearId: selectedRecruitYear?.recruitYear || 0,
  };
};
