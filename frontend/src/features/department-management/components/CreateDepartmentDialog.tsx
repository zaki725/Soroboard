'use client';

import { Dialog } from '@/components/ui';
import type { UseFormSetError } from 'react-hook-form';
import type { DepartmentFormData } from '../hooks/useDepartmentManagement';
import { CreateDepartmentForm } from './CreateDepartmentForm';

type CreateDepartmentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: DepartmentFormData,
    setFormError: UseFormSetError<DepartmentFormData>,
  ) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
};

export const CreateDepartmentDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: CreateDepartmentDialogProps) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="新規部署作成" size="md">
      <CreateDepartmentForm
        onSubmit={onSubmit}
        error={error}
        isSubmitting={isSubmitting}
        onClose={onClose}
        key={isOpen ? 'form-open' : 'form-closed'}
      />
    </Dialog>
  );
};
