import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import toast from 'react-hot-toast';
import type {
  SearchConditionResponseDto,
  CreateSearchConditionRequestDto,
  UpdateSearchConditionRequestDto,
} from '@/types/search-condition';
import { useRecruitYear } from '@/contexts/RecruitYearContext';
import { useAuth } from '@/hooks/useAuth';

type UseSearchConditionParams = {
  formType: string;
  currentPath: string;
  buildUrlParams: (searchParams: URLSearchParams) => string;
};

export const useSearchCondition = ({
  formType,
  currentPath,
  buildUrlParams: buildUrlParamsFn,
}: UseSearchConditionParams) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedRecruitYear } = useRecruitYear();
  const { user } = useAuth();
  const [savedConditions, setSavedConditions] = useState<
    SearchConditionResponseDto[]
  >([]);
  const [filteredConditions, setFilteredConditions] = useState<
    SearchConditionResponseDto[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const buildUrlParams = useCallback((): string => {
    return buildUrlParamsFn(searchParams);
  }, [searchParams, buildUrlParamsFn]);

  const fetchSavedConditions = useCallback(async () => {
    if (!selectedRecruitYear) return;

    try {
      setIsLoading(true);
      const data = await apiClient<SearchConditionResponseDto[]>(
        `/search-conditions?formType=${formType}&recruitYearId=${selectedRecruitYear.recruitYear}`,
      );
      setSavedConditions(data);
      setFilteredConditions(data);
    } catch (err) {
      const message = extractErrorMessage(
        err,
        '保存済み検索条件の取得に失敗しました',
      );
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRecruitYear, formType]);

  const searchConditions = useCallback(
    async (searchParams: { name?: string }) => {
      if (!selectedRecruitYear) return;

      try {
        setIsLoading(true);
        const data = await apiClient<SearchConditionResponseDto[]>(
          `/search-conditions?formType=${formType}&recruitYearId=${selectedRecruitYear.recruitYear}`,
        );

        let filtered = data;
        if (searchParams.name) {
          filtered = data.filter((condition) =>
            condition.name
              .toLowerCase()
              .includes(searchParams.name!.toLowerCase()),
          );
        }

        setSavedConditions(data);
        setFilteredConditions(filtered);
      } catch (err) {
        const message = extractErrorMessage(
          err,
          '検索条件の検索に失敗しました',
        );
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedRecruitYear, formType],
  );

  const saveCondition = useCallback(
    async (name: string) => {
      if (!user?.id) {
        toast.error('ログインが必要です');
        return;
      }

      if (!selectedRecruitYear) {
        toast.error('対象年度が設定されていません');
        return;
      }

      try {
        const urlParams = buildUrlParams();
        const request: CreateSearchConditionRequestDto = {
          formType,
          name,
          urlParams,
          recruitYearId: selectedRecruitYear.recruitYear,
        };

        await apiClient<SearchConditionResponseDto>('/search-conditions', {
          method: 'POST',
          body: request,
        });

        toast.success('検索条件を保存しました');
        await fetchSavedConditions();
      } catch (err) {
        const message = extractErrorMessage(
          err,
          '検索条件の保存に失敗しました',
        );
        toast.error(message);
        throw err;
      }
    },
    [
      user?.id,
      buildUrlParams,
      selectedRecruitYear,
      fetchSavedConditions,
      formType,
    ],
  );

  const updateCondition = useCallback(
    async ({ id, name }: { id: string; name: string }) => {
      if (!user?.id) {
        toast.error('ログインが必要です');
        return;
      }

      if (!selectedRecruitYear) {
        toast.error('対象年度が設定されていません');
        return;
      }

      try {
        const request: UpdateSearchConditionRequestDto = {
          id,
          name,
        };

        await apiClient<SearchConditionResponseDto>(
          `/search-conditions/${id}`,
          {
            method: 'PUT',
            body: request,
          },
        );

        toast.success('検索条件を更新しました');
        await fetchSavedConditions();
      } catch (err) {
        const message = extractErrorMessage(
          err,
          '検索条件の更新に失敗しました',
        );
        toast.error(message);
        throw err;
      }
    },
    [user?.id, selectedRecruitYear, fetchSavedConditions],
  );

  const deleteCondition = useCallback(
    async (id: string) => {
      try {
        await apiClient(`/search-conditions/${id}`, {
          method: 'DELETE',
        });

        toast.success('検索条件を削除しました');
        await fetchSavedConditions();
      } catch (err) {
        const message = extractErrorMessage(
          err,
          '検索条件の削除に失敗しました',
        );
        toast.error(message);
        throw err;
      }
    },
    [fetchSavedConditions],
  );

  const applyCondition = useCallback(
    (condition: SearchConditionResponseDto) => {
      const url = condition.urlParams
        ? `${currentPath}?${condition.urlParams}`
        : currentPath;
      router.push(url);
    },
    [router, currentPath],
  );

  return {
    savedConditions,
    filteredConditions,
    isLoading,
    fetchSavedConditions,
    searchConditions,
    saveCondition,
    updateCondition,
    deleteCondition,
    applyCondition,
  };
};
