'use client';

import { useEffect } from 'react';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { EventMasterManagement } from '@/features/event-master-management/components/EventMasterManagement';

export default function EventMasterManagementPage() {
  const { setItems } = useBreadcrumb();
  usePageTitle('イベントマスター管理');

  useEffect(() => {
    setItems([
      { label: 'ホーム', href: '/' },
      { label: 'イベントマスター管理' },
    ]);
  }, [setItems]);

  return <EventMasterManagement />;
}
