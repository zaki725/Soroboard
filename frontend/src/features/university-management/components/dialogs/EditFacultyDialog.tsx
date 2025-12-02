'use client';

import { Dialog } from '@/components/ui';
import type { UseFormSetError } from 'react-hook-form';
import type { UpdateFacultyFormData } from '../../hooks/useFacultyManagement';
import type { FacultyResponseDto } from '@/types/faculty';
import { EditFacultyForm } from './EditFacultyForm';

type EditFacultyDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: UpdateFacultyFormData,
    setError: UseFormSetError<UpdateFacultyFormData>,
  ) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  faculty: FacultyResponseDto | null;
};

export const EditFacultyDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  faculty,
}: EditFacultyDialogProps) => {
  if (!faculty) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="学部を編集" size="md">
      <EditFacultyForm
        faculty={faculty}
        onSubmit={onSubmit}
        error={error}
        isSubmitting={isSubmitting}
        onClose={onClose}
        key={isOpen ? `form-${faculty.id}` : 'form-closed'}
      />
    </Dialog>
  );
};
