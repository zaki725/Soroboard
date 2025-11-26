import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
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
  const [universities, setUniversities] = useState<UniversityResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getSearchParamsFromUrl = useCallback((): UniversitySearchFormData => {
    return {
      id: searchParams.get('id') || '',
      search: searchParams.get('search') || '',
      rank: (searchParams.get('rank') as UniversityRankLevel | null) || '',
    };
  }, [searchParams]);

  const fetchUniversities = useCallback(async () => {
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
      if (params.rank) {
        apiParams.append('rank', params.rank);
      }

      const queryString = apiParams.toString();
      const url = queryString
        ? `/universities?${queryString}`
        : '/universities';

      const data = await apiClient<UniversityResponseDto[]>(url);
      setUniversities(data);
    } catch (err) {
      const message = extractErrorMessage(
        err,
        '大学データの取得に失敗しました',
      );
      setError(message);
      setUniversities([]);
    } finally {
      setIsLoading(false);
    }
  }, [getSearchParamsFromUrl]);

  useEffect(() => {
    void fetchUniversities();
  }, [fetchUniversities]);

  const updateUrlParams = useCallback(
    (params: UniversitySearchFormData) => {
      const urlParams = new URLSearchParams();
      if (params.id) urlParams.set('id', params.id);
      if (params.search) urlParams.set('search', params.search);
      if (params.rank) urlParams.set('rank', params.rank);

      const queryString = urlParams.toString();
      const url = queryString
        ? `/master/university-management?${queryString}`
        : '/master/university-management';
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
    router.push('/master/university-management');
  };

  const currentSearchParams = getSearchParamsFromUrl();

  return {
    universities,
    isLoading,
    error,
    setError,
    handleSearch,
    handleReset,
    searchParams: currentSearchParams,
    fetchUniversities,
  };
};
