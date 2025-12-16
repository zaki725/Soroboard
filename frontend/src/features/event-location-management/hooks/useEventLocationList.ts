import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSWRData } from '@/libs/swr-client';
import { buildSWRKey } from '@/libs/swr-utils';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import type { EventLocationResponseDto } from '@/types/event-location';

type EventLocationSearchFormData = {
  id: string;
  search: string;
};

export const useEventLocationList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URLパラメータから検索条件を取得
  const getSearchParamsFromUrl =
    useCallback((): EventLocationSearchFormData => {
      return {
        id: searchParams.get('id') || '',
        search: searchParams.get('search') || '',
      };
    }, [searchParams]);

  const searchKey = useMemo(() => {
    const params = getSearchParamsFromUrl();
    return buildSWRKey('/event-locations', {
      id: params.id,
      search: params.search,
    });
  }, [getSearchParamsFromUrl]);

  // 手動で設定するエラー（CSVエクスポートなど、SWRを使わない操作のエラー）
  const [manualError, setManualError] = useState<string | null>(null);

  // SWRでデータ取得（共通のuseSWRDataを使用）
  const {
    data: eventLocations,
    error: swrError,
    isLoading,
    mutate,
  } = useSWRData<EventLocationResponseDto[]>(searchKey);

  // エラーメッセージを取得（SWRのエラーと手動で設定したエラーを統合）
  const error = useMemo(() => {
    if (manualError) return manualError;
    if (!swrError) return null;
    return extractErrorMessage(
      swrError,
      errorMessages.eventLocationListFetchFailed,
    );
  }, [swrError, manualError]);

  // fetchEventLocationsの代わりにmutateを返す（後方互換性のため）
  const fetchEventLocations = useCallback(async () => {
    await mutate();
  }, [mutate]);

  const updateUrlParams = useCallback(
    (params: EventLocationSearchFormData) => {
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
        ? `/admin/event-location-management?${queryString}`
        : '/admin/event-location-management';
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
    router.push('/admin/event-location-management');
  };

  const currentSearchParams = getSearchParamsFromUrl();

  return {
    eventLocations: eventLocations || [],
    isLoading,
    error,
    setError: setManualError, // 手動でエラーを設定（CSVエクスポートなど）
    handleSearch,
    handleReset,
    searchParams: currentSearchParams,
    fetchEventLocations,
    mutate, // SWRのmutateも公開（必要に応じて使用可能）
  };
};
