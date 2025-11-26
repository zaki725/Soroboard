'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import type { EventResponseDto } from '@/types/event';

export const useEventDetail = (eventId: string | null) => {
  const [event, setEvent] = useState<EventResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    if (!eventId) {
      setEvent(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient<EventResponseDto>(`/events/${eventId}`);
      setEvent(data);
    } catch (err) {
      const message = extractErrorMessage(
        err,
        'イベントデータの取得に失敗しました',
      );
      setError(message);
      setEvent(null);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    void fetchEvent();
  }, [fetchEvent]);

  return {
    event,
    isLoading,
    error,
    fetchEvent,
  };
};
