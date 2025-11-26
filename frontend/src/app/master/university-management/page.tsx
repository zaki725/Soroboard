'use client';

import { useEffect } from 'react';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { UniversityManagement } from '@/features/university-management/components/UniversityManagement';

export default function UniversityManagementPage() {
  const { setItems } = useBreadcrumb();
  usePageTitle('大学管理');

  useEffect(() => {
    setItems([{ label: 'ホーム', href: '/' }, { label: '大学管理' }]);
  }, [setItems]);

  return <UniversityManagement />;
}
