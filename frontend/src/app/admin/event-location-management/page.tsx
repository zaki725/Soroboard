'use client';

import { useEffect } from 'react';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { EventLocationManagement } from '@/features/event-location-management/components/EventLocationManagement';

export default function EventLocationManagementPage() {
  const { setItems } = useBreadcrumb();
  usePageTitle('ロケーション管理');

  useEffect(() => {
    setItems([{ label: 'ホーム', href: '/' }, { label: 'ロケーション管理' }]);
  }, [setItems]);

  return <EventLocationManagement />;
}
