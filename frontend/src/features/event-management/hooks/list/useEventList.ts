import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/libs/api-client';
import type { EventResponseDto } from '@/types/event';
import { useRecruitYear } from '@/contexts/RecruitYearContext';
import {
  convertDateTimeLocalToISO,
  formatDateTimeToLocal,
} from '@/libs/date-utils';

export type EventSearchFormData = {
  id: string;
  search: string;
  eventMasterId: string;
  locationId: string;
  interviewerId: string;
  startTimeFrom: string;
};

export const useEventList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedRecruitYear } = useRecruitYear();
  const [events, setEvents] = useState<EventResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getSearchParams = useCallback((): EventSearchFormData => {
    const startTimeFromParam = searchParams.get('startTimeFrom');

    return {
      id: searchParams.get('id') || '',
      search: searchParams.get('search') || '',
      eventMasterId: searchParams.get('eventMasterId') || '',
      locationId: searchParams.get('locationId') || '',
      interviewerId: searchParams.get('interviewerId') || '',
      // ISO形式の文字列をdatetime-local形式に変換
      startTimeFrom: startTimeFromParam
        ? formatDateTimeToLocal(startTimeFromParam)
        : '',
    };
  }, [searchParams]);

  const fetchEvents = useCallback(async () => {
    if (!selectedRecruitYear) {
      return;
    }

    setIsLoading(true);
    try {
      const params = getSearchParams();
      const queryParams = new URLSearchParams();
      queryParams.set('recruitYearId', String(selectedRecruitYear.recruitYear));

      if (params.id) {
        queryParams.set('id', params.id);
      }
      if (params.search) {
        queryParams.set('search', params.search);
      }
      if (params.eventMasterId) {
        queryParams.set('eventMasterId', params.eventMasterId);
      }
      if (params.locationId) {
        queryParams.set('locationId', params.locationId);
      }
      if (params.interviewerId) {
        queryParams.set('interviewerId', params.interviewerId);
      }
      if (params.startTimeFrom) {
        // datetime-local形式をISO形式に変換
        const isoFrom = convertDateTimeLocalToISO(params.startTimeFrom);
        if (isoFrom) {
          queryParams.set('startTimeFrom', isoFrom);
        }
      }

      const data = await apiClient<EventResponseDto[]>(
        `/events?${queryParams.toString()}`,
      );
      setEvents(data);
    } catch (error) {
      console.error('イベント一覧の取得に失敗しました:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [getSearchParams, selectedRecruitYear]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSearch = useCallback(
    (data: EventSearchFormData) => {
      const params = new URLSearchParams();
      if (data.id) {
        params.set('id', data.id);
      }
      if (data.search) {
        params.set('search', data.search);
      }
      if (data.eventMasterId) {
        params.set('eventMasterId', data.eventMasterId);
      }
      if (data.locationId) {
        params.set('locationId', data.locationId);
      }
      if (data.interviewerId) {
        params.set('interviewerId', data.interviewerId);
      }
      if (data.startTimeFrom) {
        // datetime-local形式をISO形式に変換
        const isoFrom = convertDateTimeLocalToISO(data.startTimeFrom);
        if (isoFrom) {
          params.set('startTimeFrom', isoFrom);
        }
      }
      router.push(`/admin/event-management?${params.toString()}`);
    },
    [router],
  );

  const handleReset = useCallback(() => {
    router.push('/admin/event-management');
  }, [router]);

  return {
    events,
    isLoading,
    searchParams: getSearchParams(),
    handleSearch,
    handleReset,
    refetch: fetchEvents,
  };
};
