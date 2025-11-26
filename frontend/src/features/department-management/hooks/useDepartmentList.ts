import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import type { DepartmentResponseDto } from '@/types/department';

type DepartmentSearchFormData = {
  id: string;
  search: string;
};

export const useDepartmentList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [departments, setDepartments] = useState<DepartmentResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getSearchParamsFromUrl = useCallback((): DepartmentSearchFormData => {
    return {
      id: searchParams.get('id') || '',
      search: searchParams.get('search') || '',
    };
  }, [searchParams]);

  const fetchDepartments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = getSearchParamsFromUrl();
      const apiParams = new URLSearchParams();

      if (params.id) {
        apiParams.append('id', params.id);
      }
      if (params.search) {
        apiParams.append('search', params.search);
      }

      const queryString = apiParams.toString();
      const url = queryString ? `/departments?${queryString}` : '/departments';

      const data = await apiClient<DepartmentResponseDto[]>(url);
      setDepartments(data);
    } catch (err) {
      const message = extractErrorMessage(
        err,
        '部署データの取得に失敗しました',
      );
      setError(message);
      setDepartments([]);
    } finally {
      setIsLoading(false);
    }
  }, [getSearchParamsFromUrl]);

  useEffect(() => {
    void fetchDepartments();
  }, [fetchDepartments]);

  const updateUrlParams = useCallback(
    (params: DepartmentSearchFormData) => {
      const urlParams = new URLSearchParams();
      if (params.id) urlParams.set('id', params.id);
      if (params.search) urlParams.set('search', params.search);

      const queryString = urlParams.toString();
      const url = queryString
        ? `/master/department-management?${queryString}`
        : '/master/department-management';
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
    router.push('/master/department-management');
  };

  const currentSearchParams = getSearchParamsFromUrl();

  return {
    departments,
    isLoading,
    error,
    setError,
    handleSearch,
    handleReset,
    searchParams: currentSearchParams,
    fetchDepartments,
  };
};
