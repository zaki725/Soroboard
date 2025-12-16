'use client';

import { useEffect } from 'react';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { DepartmentManagement } from '@/features/department-management/components/DepartmentManagement';

export default function DepartmentManagementPage() {
  const { setItems } = useBreadcrumb();
  usePageTitle('部署管理');

  useEffect(() => {
    setItems([{ label: 'ホーム', href: '/' }, { label: '部署管理' }]);
  }, [setItems]);

  return <DepartmentManagement />;
}
