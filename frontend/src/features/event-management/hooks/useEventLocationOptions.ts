import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/libs/api-client';
import type { EventLocationResponseDto } from '@/types/event-location';

export const useEventLocationOptions = () => {
  const [eventLocations, setEventLocations] = useState<
    EventLocationResponseDto[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEventLocations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data =
        await apiClient<EventLocationResponseDto[]>('/event-locations');
      setEventLocations(data);
    } catch (error) {
      console.error('ロケーション一覧の取得に失敗しました:', error);
      setEventLocations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadEventLocations = async () => {
      try {
        const data =
          await apiClient<EventLocationResponseDto[]>('/event-locations');
        setEventLocations(data);
      } catch (error) {
        console.error('ロケーション一覧の取得に失敗しました:', error);
        setEventLocations([]);
      }
    };
    void loadEventLocations();
  }, []);

  const eventLocationOptions = eventLocations.map((el) => ({
    value: el.id,
    label: el.name,
  }));

  return {
    eventLocations,
    eventLocationOptions,
    refetch: fetchEventLocations,
    isLoading,
  };
};
