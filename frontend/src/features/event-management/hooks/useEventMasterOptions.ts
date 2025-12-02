import { useMemo } from 'react';
import { useSWRData } from '@/libs/swr-client';
import { buildSWRKey } from '@/libs/swr-utils';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import type { EventMasterResponseDto } from '@/types/event-master';
import { useRecruitYear } from '@/contexts/RecruitYearContext';

export const useEventMasterOptions = () => {
  const { selectedRecruitYear } = useRecruitYear();

  const searchKey = useMemo(() => {
    if (!selectedRecruitYear) {
      return null; // 年度が選択されていない場合はデータ取得しない
    }

    return buildSWRKey('/event-masters', undefined, {
      recruitYearId: selectedRecruitYear.recruitYear,
    });
  }, [selectedRecruitYear]);

  // SWRでデータ取得（画面描画なのでSWRを使用）
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

  const eventMasterOptions = useMemo(
    () =>
      (eventMasters || []).map((em) => ({
        value: em.id,
        label: em.name,
      })),
    [eventMasters],
  );

  // refetchの代わりにmutateを返す（後方互換性のため）
  const refetch = async () => {
    await mutate();
  };

  return {
    eventMasters: eventMasters || [],
    eventMasterOptions,
    refetch,
    isLoading,
    error,
    mutate, // SWRのmutateも公開（必要に応じて使用可能）
  };
};
