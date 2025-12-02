'use client';

import { Dialog } from '@/components/ui';
import type { UseFormSetError } from 'react-hook-form';
import type { FacultyFormData } from '../../hooks/useFacultyManagement';
import { CreateFacultyForm } from './CreateFacultyForm';

type CreateFacultyDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: FacultyFormData,
    setFormError: UseFormSetError<FacultyFormData>,
  ) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  universityId: string;
};

export const CreateFacultyDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  universityId,
}: CreateFacultyDialogProps) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="学部を追加" size="md">
      <CreateFacultyForm
        onSubmit={onSubmit}
        error={error}
        isSubmitting={isSubmitting}
        onClose={onClose}
        universityId={universityId}
        key={isOpen ? 'form-open' : 'form-closed'}
      />
    </Dialog>
  );
};
