import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import type { EventLocationResponseDto } from '@/types/event-location';

type EventLocationSearchFormData = {
  id: string;
  search: string;
};

export const useEventLocationList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [eventLocations, setEventLocations] = useState<
    EventLocationResponseDto[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getSearchParamsFromUrl =
    useCallback((): EventLocationSearchFormData => {
      return {
        id: searchParams.get('id') || '',
        search: searchParams.get('search') || '',
      };
    }, [searchParams]);

  const fetchEventLocations = useCallback(async () => {
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
      const url = queryString
        ? `/event-locations?${queryString}`
        : '/event-locations';

      const data = await apiClient<EventLocationResponseDto[]>(url);
      setEventLocations(data);
    } catch (err) {
      const message = extractErrorMessage(
        err,
        'ロケーションデータの取得に失敗しました',
      );
      setError(message);
      setEventLocations([]);
    } finally {
      setIsLoading(false);
    }
  }, [getSearchParamsFromUrl]);

  useEffect(() => {
    void fetchEventLocations();
  }, [fetchEventLocations]);

  const updateUrlParams = useCallback(
    (params: EventLocationSearchFormData) => {
      const urlParams = new URLSearchParams();
      if (params.id) urlParams.set('id', params.id);
      if (params.search) urlParams.set('search', params.search);

      const queryString = urlParams.toString();
      const url = queryString
        ? `/master/event-location-management?${queryString}`
        : '/master/event-location-management';
      router.push(url);
    },
    [router],
  );

  const handleSearch = (data: EventLocationSearchFormData) => {
    // URLのみを変更し、状態はURLパラメータの変更検知から更新させる
    updateUrlParams(data);
  };

  const handleReset = () => {
    // URLのみを変更し、状態はURLパラメータの変更検知から更新させる
    router.push('/master/event-location-management');
  };

  const currentSearchParams = getSearchParamsFromUrl();

  return {
    eventLocations,
    isLoading,
    error,
    setError,
    handleSearch,
    handleReset,
    searchParams: currentSearchParams,
    fetchEventLocations,
  };
};
