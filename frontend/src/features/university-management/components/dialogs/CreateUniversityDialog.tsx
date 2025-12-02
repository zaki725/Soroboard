'use client';

import { Dialog } from '@/components/ui';
import type { UseFormSetError } from 'react-hook-form';
import type { UniversityFormData } from '../../hooks/useUniversityManagement';
import { CreateUniversityForm } from './CreateUniversityForm';

type CreateUniversityDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: UniversityFormData,
    setFormError: UseFormSetError<UniversityFormData>,
  ) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
};

export const CreateUniversityDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: CreateUniversityDialogProps) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="新規大学作成" size="md">
      <CreateUniversityForm
        onSubmit={onSubmit}
        error={error}
        isSubmitting={isSubmitting}
        onClose={onClose}
        key={isOpen ? 'form-open' : 'form-closed'}
      />
    </Dialog>
  );
};
