import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import type { UniversityResponseDto } from '@/types/university';
import type { FacultyResponseDto } from '@/types/faculty';

export const useUniversityDetail = (universityId: string | null) => {
  const [university, setUniversity] = useState<UniversityResponseDto | null>(
    null,
  );
  const [faculties, setFaculties] = useState<FacultyResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversity = useCallback(async () => {
    if (!universityId) return;

    try {
      setIsLoading(true);
      setError(null);

      const [universityData, facultiesData] = await Promise.all([
        apiClient<UniversityResponseDto[]>(`/universities?id=${universityId}`),
        apiClient<FacultyResponseDto[]>(
          `/universities/${universityId}/faculties`,
        ),
      ]);

      if (universityData.length > 0) {
        setUniversity(universityData[0]);
      }
      setFaculties(facultiesData);
    } catch (err) {
      const message = extractErrorMessage(err, '大学情報の取得に失敗しました');
      setError(message);
      setUniversity(null);
      setFaculties([]);
    } finally {
      setIsLoading(false);
    }
  }, [universityId]);

  useEffect(() => {
    void fetchUniversity();
  }, [fetchUniversity]);

  const refreshFaculties = useCallback(async () => {
    if (!universityId) return;

    try {
      const facultiesData = await apiClient<FacultyResponseDto[]>(
        `/universities/${universityId}/faculties`,
      );
      setFaculties(facultiesData);
    } catch (err) {
      const message = extractErrorMessage(err, '学部情報の取得に失敗しました');
      setError(message);
    }
  }, [universityId]);

  const refreshUniversity = useCallback(async () => {
    if (!universityId) return;

    try {
      const universityData = await apiClient<UniversityResponseDto[]>(
        `/universities?id=${universityId}`,
      );

      if (universityData.length > 0) {
        setUniversity(universityData[0]);
      }
    } catch (err) {
      const message = extractErrorMessage(err, '大学情報の取得に失敗しました');
      setError(message);
    }
  }, [universityId]);

  return {
    university,
    faculties,
    isLoading,
    error,
    refreshFaculties,
    refreshUniversity,
  };
};
