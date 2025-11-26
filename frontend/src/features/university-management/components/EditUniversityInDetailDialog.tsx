'use client';

import { Dialog } from '@/components/ui';
import { EditUniversityForm } from './EditUniversityForm';
import type { UniversityResponseDto } from '@/types/university';
import type { UniversityFormData } from '../hooks/useUniversityManagement';
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
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="大学を編集"
      size="lg"
      footer={
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            キャンセル
          </button>
        </div>
      }
    >
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
