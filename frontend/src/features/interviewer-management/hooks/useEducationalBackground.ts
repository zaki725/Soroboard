import { useState, useCallback } from 'react';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import type { EducationalBackgroundResponseDto } from '@/types/educational-background';

export const useEducationalBackground = (interviewerId: string | null) => {
  const [educationalBackgrounds, setEducationalBackgrounds] = useState<
    EducationalBackgroundResponseDto[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEducationalBackgrounds = useCallback(async () => {
    if (!interviewerId) {
      setEducationalBackgrounds([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data =
        (await apiClient<EducationalBackgroundResponseDto[]>(
          `/educational-backgrounds/interviewers/${interviewerId}`,
        )) ?? [];
      setEducationalBackgrounds(data);
    } catch (err) {
      const errorMessage = extractErrorMessage(
        err,
        '学歴情報の取得に失敗しました',
      );
      setError(errorMessage);
      setEducationalBackgrounds([]);
    } finally {
      setIsLoading(false);
    }
  }, [interviewerId]);

  return {
    educationalBackgrounds,
    isLoading,
    error,
    fetchEducationalBackgrounds,
    setEducationalBackgrounds,
  };
};
