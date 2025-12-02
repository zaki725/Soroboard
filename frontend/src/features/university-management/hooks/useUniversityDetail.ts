import { useMemo } from 'react';
import { useSWRData } from '@/libs/swr-client';
import { extractErrorMessage } from '@/libs/error-handler';
import type { UniversityResponseDto } from '@/types/university';
import type { FacultyResponseDto } from '@/types/faculty';

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

  const {
    data: faculties,
    error: facultiesError,
    isLoading: isLoadingFaculties,
    mutate: mutateFaculties,
  } = useSWRData<FacultyResponseDto[]>(
    universityId ? `/universities/${universityId}/faculties` : null,
  );

  // エラーメッセージを取得
  const error = useMemo(() => {
    if (universityError) {
      return extractErrorMessage(
        universityError,
        '大学情報の取得に失敗しました',
      );
    }
    if (facultiesError) {
      return extractErrorMessage(
        facultiesError,
        '学部情報の取得に失敗しました',
      );
    }
    return null;
  }, [universityError, facultiesError]);

  const university =
    universityData && universityData.length > 0 ? universityData[0] : null;
  const isLoading = isLoadingUniversity || isLoadingFaculties;

  // refreshFacultiesの代わりにmutateを返す（後方互換性のため）
  const refreshFaculties = async () => {
    await mutateFaculties();
  };

  // refreshUniversityの代わりにmutateを返す（後方互換性のため）
  const refreshUniversity = async () => {
    await mutateUniversity();
  };

  return {
    university,
    faculties: faculties || [],
    isLoading,
    error,
    refreshFaculties,
    refreshUniversity,
    mutateFaculties, // SWRのmutateも公開（必要に応じて使用可能）
    mutateUniversity, // SWRのmutateも公開（必要に応じて使用可能）
  };
};
