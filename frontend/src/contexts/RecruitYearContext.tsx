'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { RecruitYearResponseDto } from '@/types/recruit-year';

type RecruitYearContextType = {
  recruitYears: RecruitYearResponseDto[];
  selectedRecruitYear: RecruitYearResponseDto | null;
  setSelectedRecruitYear: (year: RecruitYearResponseDto | null) => void;
  setRecruitYears: (years: RecruitYearResponseDto[]) => void;
  isLoading: boolean;
  error: Error | null;
};

const RecruitYearContext = createContext<RecruitYearContextType | undefined>(
  undefined,
);

import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';

export const RecruitYearProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [recruitYears, setRecruitYears] = useState<RecruitYearResponseDto[]>(
    [],
  );
  const [selectedRecruitYear, setSelectedRecruitYear] =
    useState<RecruitYearResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const hasFetchedRef = useRef(false);
  const previousRecruitYearIdRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // 既にデータがある場合は再取得しない
    if (recruitYears.length > 0) {
      setIsLoading(false);
      hasFetchedRef.current = true;
      return;
    }

    // 既に取得済みの場合は再取得しない
    if (hasFetchedRef.current) {
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data =
          await apiClient<RecruitYearResponseDto[]>('/recruit-years');

        setRecruitYears(data);
        if (data.length === 0) {
          setError(new Error('対象年度が設定されていません'));
          hasFetchedRef.current = true;
          return;
        }
        const initialYear = data[0];
        const year = initialYear;
        setSelectedRecruitYear(year);
        previousRecruitYearIdRef.current = year.recruitYear;
        isInitializedRef.current = true;
        setError(null);
        hasFetchedRef.current = true;
      } catch (err) {
        const message = extractErrorMessage(
          err,
          '予期せぬエラーが発生しました',
        );
        const error = new Error(message);

        // 既存のデータがある場合はエラーを設定しない（既存の状態を保持）
        setRecruitYears((prev) => {
          if (prev.length > 0) {
            hasFetchedRef.current = true;
            return prev;
          }
          hasFetchedRef.current = true;
          return [];
        });

        // 既存の選択年度がある場合はエラーを設定しない
        setSelectedRecruitYear((prev) => {
          if (prev) {
            setError(null);
            return prev;
          }
          setError(error);
          return null;
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [recruitYears.length]);

  // 年度変更時にダッシュボードに遷移
  useEffect(() => {
    if (!selectedRecruitYear || !isInitializedRef.current) return;

    const currentRecruitYearId = selectedRecruitYear.recruitYear;
    const previousRecruitYearId = previousRecruitYearIdRef.current;

    // 年度が変更された場合（初期化時を除く）
    if (
      previousRecruitYearId !== null &&
      previousRecruitYearId !== currentRecruitYearId &&
      pathname !== '/'
    ) {
      router.push('/');
    }

    previousRecruitYearIdRef.current = currentRecruitYearId;
  }, [selectedRecruitYear, router, pathname]);

  const handleSetSelectedRecruitYear = (
    year: RecruitYearResponseDto | null,
  ) => {
    setSelectedRecruitYear(year);
  };

  const value = useMemo(
    () => ({
      recruitYears,
      selectedRecruitYear,
      setSelectedRecruitYear: handleSetSelectedRecruitYear,
      setRecruitYears,
      isLoading,
      error,
    }),
    [recruitYears, selectedRecruitYear, setRecruitYears, isLoading, error],
  );

  return (
    <RecruitYearContext.Provider value={value}>
      {children}
    </RecruitYearContext.Provider>
  );
};

export const useRecruitYear = () => {
  const context = useContext(RecruitYearContext);
  if (context === undefined) {
    throw new Error('useRecruitYear must be used within a RecruitYearProvider');
  }
  return context;
};
