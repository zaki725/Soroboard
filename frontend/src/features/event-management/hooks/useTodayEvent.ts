'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/libs/api-client';
import type { EventResponseDto } from '@/types/event';
import { useRecruitYear } from '@/contexts/RecruitYearContext';

export const useTodayEvent = () => {
  const { selectedRecruitYear } = useRecruitYear();
  const [todayEvent, setTodayEvent] = useState<EventResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTodayEvent = useCallback(async () => {
    if (!selectedRecruitYear) {
      setTodayEvent(null);
      return;
    }

    setIsLoading(true);
    try {
      const today = new Date();
      const todayStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
      );
      const todayEnd = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
      );

      const queryParams = new URLSearchParams();
      queryParams.set('recruitYearId', String(selectedRecruitYear.recruitYear));
      queryParams.set('startTimeFrom', todayStart.toISOString());
      queryParams.set('startTimeTo', todayEnd.toISOString());

      const events = await apiClient<EventResponseDto[]>(
        `/events?${queryParams.toString()}`,
      );

      // 今日の最初のイベントを取得
      const firstEvent = events.length > 0 ? events[0] : null;
      setTodayEvent(firstEvent);
    } catch (error) {
      console.error('今日のイベントの取得に失敗しました:', error);
      setTodayEvent(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRecruitYear]);

  useEffect(() => {
    void fetchTodayEvent();
  }, [fetchTodayEvent]);

  return {
    todayEvent,
    isLoading,
  };
};
