'use client';

import { useEffect } from 'react';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { EventManagement } from '@/features/event-management/components/list/EventManagement';

export default function EventManagementPage() {
  const { setItems } = useBreadcrumb();
  usePageTitle('イベント管理');

  useEffect(() => {
    setItems([{ label: 'ホーム', href: '/' }, { label: 'イベント管理' }]);
  }, [setItems]);

  return <EventManagement />;
}
