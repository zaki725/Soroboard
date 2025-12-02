'use client';

import { Dialog } from '@/components/ui';
import type { UseFormSetError } from 'react-hook-form';
import type { UniversityFormData } from '../../hooks/useUniversityManagement';
import type { UniversityResponseDto } from '@/types/university';
import { EditUniversityForm } from './EditUniversityForm';

type EditUniversityDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: UniversityFormData,
    setError: UseFormSetError<UniversityFormData>,
  ) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  university: UniversityResponseDto | null;
};

export const EditUniversityDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  university,
}: EditUniversityDialogProps) => {
  if (!university) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="大学編集" size="md">
      <EditUniversityForm
        university={university}
        onSubmit={onSubmit}
        error={error}
        isSubmitting={isSubmitting}
        onClose={onClose}
        key={isOpen ? `form-${university.id}` : 'form-closed'}
      />
    </Dialog>
  );
};
