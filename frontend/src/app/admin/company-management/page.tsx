'use client';

import { useEffect } from 'react';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { CompanyManagement } from '@/features/company-management/components/CompanyManagement';

export default function CompanyManagementPage() {
  const { setItems } = useBreadcrumb();
  usePageTitle('会社管理');

  useEffect(() => {
    setItems([{ label: 'ホーム', href: '/' }, { label: '会社管理' }]);
  }, [setItems]);

  return <CompanyManagement />;
}
