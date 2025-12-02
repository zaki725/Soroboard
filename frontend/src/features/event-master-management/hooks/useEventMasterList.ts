import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSWRData } from '@/libs/swr-client';
import { buildSWRKey } from '@/libs/swr-utils';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
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

  const getSearchParams = useCallback((): EventMasterSearchFormData => {
    return {
      id: searchParams.get('id') || '',
      search: searchParams.get('search') || '',
      type: searchParams.get('type') || '',
    };
  }, [searchParams]);

  const searchKey = useMemo(() => {
    if (!selectedRecruitYear) {
      return null; // 年度が選択されていない場合はデータ取得しない
    }

    const params = getSearchParams();
    return buildSWRKey(
      '/event-masters',
      {
        id: params.id,
        search: params.search,
        type: params.type,
      },
      {
        recruitYearId: selectedRecruitYear.recruitYear,
      },
    );
  }, [selectedRecruitYear, getSearchParams]);

  // SWRでデータ取得（共通のuseSWRDataを使用）
  const {
    data: eventMasters,
    error: swrError,
    isLoading,
    mutate,
  } = useSWRData<EventMasterResponseDto[]>(searchKey);

  // エラーメッセージを取得
  const error = useMemo(() => {
    if (!swrError) return null;
    return extractErrorMessage(
      swrError,
      errorMessages.eventMasterListFetchFailed,
    );
  }, [swrError]);

  const handleSearch = useCallback(
    (data: EventMasterSearchFormData) => {
      const params = new URLSearchParams();

      // 値がある場合のみパラメータに追加
      const paramMap: Record<string, string> = {
        id: data.id,
        search: data.search,
        type: data.type,
      };

      for (const [key, value] of Object.entries(paramMap)) {
        if (value) {
          params.set(key, value);
        }
      }

      router.push(`/master/event-master-management?${params.toString()}`);
    },
    [router],
  );

  const handleReset = useCallback(() => {
    router.push('/master/event-master-management');
  }, [router]);

  // refetchの代わりにmutateを返す（後方互換性のため）
  const refetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    eventMasters: eventMasters || [],
    isLoading,
    error,
    searchParams: getSearchParams(),
    handleSearch,
    handleReset,
    refetch,
    mutate, // SWRのmutateも公開（必要に応じて使用可能）
  };
};
