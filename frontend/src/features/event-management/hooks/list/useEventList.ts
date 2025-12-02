import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSWRData } from '@/libs/swr-client';
import { buildSWRKey } from '@/libs/swr-utils';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
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

  const searchKey = useMemo(() => {
    if (!selectedRecruitYear) {
      return null; // 年度が選択されていない場合はデータ取得しない
    }

    const params = getSearchParams();
    // startTimeFromは特別な処理が必要（datetime-local形式をISO形式に変換）
    const startTimeFromISO = params.startTimeFrom
      ? convertDateTimeLocalToISO(params.startTimeFrom)
      : null;

    return buildSWRKey(
      '/events',
      {
        id: params.id,
        search: params.search,
        eventMasterId: params.eventMasterId,
        locationId: params.locationId,
        interviewerId: params.interviewerId,
        startTimeFrom: startTimeFromISO,
      },
      {
        recruitYearId: selectedRecruitYear.recruitYear,
      },
    );
  }, [selectedRecruitYear, getSearchParams]);

  // SWRでデータ取得（共通のuseSWRDataを使用）
  const {
    data: events,
    error: swrError,
    isLoading,
    mutate,
  } = useSWRData<EventResponseDto[]>(searchKey);

  // エラーメッセージを取得
  const error = useMemo(() => {
    if (!swrError) return null;
    return extractErrorMessage(swrError, errorMessages.eventListFetchFailed);
  }, [swrError]);

  const handleSearch = useCallback(
    (data: EventSearchFormData) => {
      const params = new URLSearchParams();

      // 値がある場合のみパラメータに追加
      const paramMap: Record<string, string> = {
        id: data.id,
        search: data.search,
        eventMasterId: data.eventMasterId,
        locationId: data.locationId,
        interviewerId: data.interviewerId,
      };

      for (const [key, value] of Object.entries(paramMap)) {
        if (value) {
          params.set(key, value);
        }
      }

      // startTimeFromは特別な処理が必要
      if (data.startTimeFrom) {
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

  // refetchの代わりにmutateを返す（後方互換性のため）
  const refetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    events: events || [],
    isLoading,
    error,
    searchParams: getSearchParams(),
    handleSearch,
    handleReset,
    refetch,
    mutate, // SWRのmutateも公開（必要に応じて使用可能）
  };
};
