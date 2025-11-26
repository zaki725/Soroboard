'use client';

import { Dialog } from '@/components/ui';
import type { UseFormSetError } from 'react-hook-form';
import type { DepartmentFormData } from '../hooks/useDepartmentManagement';
import type { DepartmentResponseDto } from '@/types/department';
import { EditDepartmentForm } from './EditDepartmentForm';

type EditDepartmentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: DepartmentFormData,
    setError: UseFormSetError<DepartmentFormData>,
  ) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  department: DepartmentResponseDto | null;
};

export const EditDepartmentDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  department,
}: EditDepartmentDialogProps) => {
  if (!department) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="部署編集" size="md">
      <EditDepartmentForm
        department={department}
        onSubmit={onSubmit}
        error={error}
        isSubmitting={isSubmitting}
        onClose={onClose}
        key={isOpen ? `form-${department.id}` : 'form-closed'}
      />
    </Dialog>
  );
};
