'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useEventDetail } from './useEventDetail';
import { useInterviewerOptions } from '../useInterviewerOptions';

type UseEventDetailPageParams = {
  eventId: string;
};

export const useEventDetailPage = ({ eventId }: UseEventDetailPageParams) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setItems } = useBreadcrumb();
  usePageTitle('イベント詳細');
  const { event, isLoading, error, fetchEvent } = useEventDetail(eventId);
  const { interviewerOptions } = useInterviewerOptions();

  const handleBack = () => {
    // URLパラメータから検索条件を取得して保持
    const queryString = searchParams.toString();
    const url = queryString
      ? `/admin/event-management?${queryString}`
      : '/admin/event-management';
    router.push(url);
  };

  useEffect(() => {
    setItems([
      { label: 'ホーム', href: '/' },
      { label: 'イベント管理', href: '/admin/event-management' },
      { label: 'イベント詳細' },
    ]);
  }, [setItems]);

  return {
    event,
    isLoading,
    error,
    fetchEvent,
    interviewerOptions,
    handleBack,
  };
};
