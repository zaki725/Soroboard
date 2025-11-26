import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/libs/api-client';
import type { EventMasterResponseDto } from '@/types/event-master';
import { useRecruitYear } from '@/contexts/RecruitYearContext';

export type EventMasterSearchFormData = {
  id: string;
  search: string;
  type: string;
};

export const useEventMasterList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedRecruitYear } = useRecruitYear();
  const [eventMasters, setEventMasters] = useState<EventMasterResponseDto[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  const getSearchParams = useCallback((): EventMasterSearchFormData => {
    return {
      id: searchParams.get('id') || '',
      search: searchParams.get('search') || '',
      type: searchParams.get('type') || '',
    };
  }, [searchParams]);

  const fetchEventMasters = useCallback(async () => {
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
      if (params.type) {
        queryParams.set('type', params.type);
      }

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
  }, [getSearchParams, selectedRecruitYear]);

  useEffect(() => {
    fetchEventMasters();
  }, [fetchEventMasters]);

  const handleSearch = useCallback(
    (data: EventMasterSearchFormData) => {
      const params = new URLSearchParams();
      if (data.id) {
        params.set('id', data.id);
      }
      if (data.search) {
        params.set('search', data.search);
      }
      if (data.type) {
        params.set('type', data.type);
      }
      router.push(`/master/event-master-management?${params.toString()}`);
    },
    [router],
  );

  const handleReset = useCallback(() => {
    router.push('/master/event-master-management');
  }, [router]);

  return {
    eventMasters,
    isLoading,
    searchParams: getSearchParams(),
    handleSearch,
    handleReset,
    refetch: fetchEventMasters,
  };
};
