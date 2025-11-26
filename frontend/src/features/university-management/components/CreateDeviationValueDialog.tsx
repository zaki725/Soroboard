'use client';

import { Dialog } from '@/components/ui';
import type { UseFormSetError } from 'react-hook-form';
import type { DeviationValueFormData } from '../hooks/useFacultyManagement';
import { CreateDeviationValueForm } from './CreateDeviationValueForm';

type CreateDeviationValueDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: DeviationValueFormData,
    setFormError: UseFormSetError<DeviationValueFormData>,
  ) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  facultyId: string | null;
};

export const CreateDeviationValueDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  facultyId,
}: CreateDeviationValueDialogProps) => {
  if (!facultyId || facultyId === '') return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="偏差値を追加" size="md">
      <CreateDeviationValueForm
        onSubmit={onSubmit}
        error={error}
        isSubmitting={isSubmitting}
        onClose={onClose}
        facultyId={facultyId}
        key={isOpen ? 'form-open' : 'form-closed'}
      />
    </Dialog>
  );
};
