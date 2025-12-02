'use client';

import { Dialog } from '@/components/ui';
import { EditUniversityForm } from './EditUniversityForm';
import type { UniversityResponseDto } from '@/types/university';
import type { UniversityFormData } from '../../hooks/useUniversityManagement';
import type { UseFormSetError } from 'react-hook-form';

type EditUniversityInDetailDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  university: UniversityResponseDto;
  onSubmit: (
    data: UniversityFormData,
    setError: UseFormSetError<UniversityFormData>,
  ) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
};

export const EditUniversityInDetailDialog = ({
  isOpen,
  onClose,
  university,
  onSubmit,
  isSubmitting,
  error,
}: EditUniversityInDetailDialogProps) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="大学を編集" size="lg">
      <EditUniversityForm
        university={university}
        onSubmit={onSubmit}
        error={error}
        isSubmitting={isSubmitting}
        onClose={onClose}
      />
    </Dialog>
  );
};
