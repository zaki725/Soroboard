import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/libs/api-client';
import type { EventMasterResponseDto } from '@/types/event-master';
import { useRecruitYear } from '@/contexts/RecruitYearContext';

export const useEventMasterOptions = () => {
  const { selectedRecruitYear } = useRecruitYear();
  const [isLoading, setIsLoading] = useState(false);
  const [eventMasters, setEventMasters] = useState<EventMasterResponseDto[]>(
    [],
  );

  const fetchEventMasters = useCallback(async () => {
    setIsLoading(true);
    if (!selectedRecruitYear) {
      setEventMasters([]);
      return;
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.set('recruitYearId', String(selectedRecruitYear.recruitYear));

      const data = await apiClient<EventMasterResponseDto[]>(
        `/event-masters?${queryParams.toString()}`,
      );
      setEventMasters(data);
    } catch (error) {
      console.error('イベントマスター一覧の取得に失敗しました:', error);
      setEventMasters([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRecruitYear]);

  useEffect(() => {
    const loadEventMasters = async () => {
      if (!selectedRecruitYear) {
        setEventMasters([]);
        setIsLoading(false);
        return;
      }

      try {
        const queryParams = new URLSearchParams();
        queryParams.set(
          'recruitYearId',
          String(selectedRecruitYear.recruitYear),
        );

        const data = await apiClient<EventMasterResponseDto[]>(
          `/event-masters?${queryParams.toString()}`,
        );
        setEventMasters(data);
      } catch (error) {
        console.error('イベントマスター一覧の取得に失敗しました:', error);
        setEventMasters([]);
        setIsLoading(false);
      }
    };
    void loadEventMasters();
  }, [selectedRecruitYear]);

  const eventMasterOptions = eventMasters.map((em) => ({
    value: em.id,
    label: em.name,
  }));

  return {
    eventMasters,
    eventMasterOptions,
    refetch: fetchEventMasters,
    isLoading,
  };
};
