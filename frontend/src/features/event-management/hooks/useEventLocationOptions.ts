import { useMemo } from 'react';
import { useSWRData } from '@/libs/swr-client';
import type { EventLocationResponseDto } from '@/types/event-location';

export const useEventLocationOptions = () => {
  // SWRでデータ取得（画面描画なのでSWRを使用）
  const {
    data: eventLocations,
    isLoading,
    mutate,
  } = useSWRData<EventLocationResponseDto[]>('/event-locations');

  const eventLocationOptions = useMemo(
    () =>
      (eventLocations || []).map((el) => ({
        value: el.id,
        label: el.name,
      })),
    [eventLocations],
  );

  // refetchの代わりにmutateを返す（後方互換性のため）
  const refetch = async () => {
    await mutate();
  };

  return {
    eventLocations: eventLocations || [],
    eventLocationOptions,
    refetch,
    isLoading,
    mutate, // SWRのmutateも公開（必要に応じて使用可能）
  };
};
