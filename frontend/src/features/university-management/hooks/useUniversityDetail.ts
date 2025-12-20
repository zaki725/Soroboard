import { useMemo } from 'react';
import { useSWRData } from '@/libs/swr-client';
import { extractErrorMessage } from '@/libs/error-handler';
import type { UniversityResponseDto } from '@/types/university';

export const useUniversityDetail = (universityId: string | null) => {
  // SWRでデータ取得（画面描画なのでSWRを使用）
  const {
    data: universityData,
    error: universityError,
    isLoading: isLoadingUniversity,
    mutate: mutateUniversity,
  } = useSWRData<UniversityResponseDto[]>(
    universityId ? `/universities?id=${universityId}` : null,
  );

  // エラーメッセージを取得
  const error = useMemo(() => {
    if (universityError) {
      return extractErrorMessage(
        universityError,
        '大学情報の取得に失敗しました',
      );
    }
    return null;
  }, [universityError]);

  const university =
    universityData && universityData.length > 0 ? universityData[0] : null;
  const isLoading = isLoadingUniversity;

  // refreshUniversityの代わりにmutateを返す（後方互換性のため）
  const refreshUniversity = async () => {
    await mutateUniversity();
  };

  return {
    university,
    isLoading,
    error,
    refreshUniversity,
    mutateUniversity, // SWRのmutateも公開（必要に応じて使用可能）
  };
};
