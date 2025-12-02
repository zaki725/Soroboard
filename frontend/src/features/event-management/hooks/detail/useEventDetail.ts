'use client';

import { useMemo } from 'react';
import { useSWRData } from '@/libs/swr-client';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import type { EventResponseDto } from '@/types/event';

export const useEventDetail = (eventId: string | null) => {
  // SWRでデータ取得（画面描画なのでSWRを使用）
  const {
    data: event,
    error: swrError,
    isLoading,
    mutate,
  } = useSWRData<EventResponseDto>(eventId ? `/events/${eventId}` : null);

  // エラーメッセージを取得
  const error = useMemo(() => {
    if (!swrError) return null;
    return extractErrorMessage(swrError, errorMessages.eventDetailFetchFailed);
  }, [swrError]);

  // fetchEventの代わりにmutateを返す（後方互換性のため）
  const fetchEvent = async () => {
    await mutate();
  };

  return {
    event: event || null,
    isLoading,
    error,
    fetchEvent,
    mutate, // SWRのmutateも公開（必要に応じて使用可能）
  };
};
