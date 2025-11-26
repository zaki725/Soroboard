'use client';

import { Dialog } from '@/components/ui';
import type { UseFormSetError } from 'react-hook-form';
import type { EducationalBackgroundFormData } from '../hooks/useEducationalBackgroundManagement';
import type { EducationalBackgroundResponseDto } from '@/types/educational-background';
import type { UniversityResponseDto } from '@/types/university';
import { EducationalBackgroundForm } from './EducationalBackgroundForm';

type EducationalBackgroundDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: EducationalBackgroundFormData,
    setError: UseFormSetError<EducationalBackgroundFormData>,
  ) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  educationalBackground: EducationalBackgroundResponseDto | null;
  universities: UniversityResponseDto[];
  isEdit?: boolean;
};

export const EducationalBackgroundDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  educationalBackground,
  universities,
  isEdit = false,
}: EducationalBackgroundDialogProps) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? '学歴を編集' : '学歴を追加'}
      size="md"
    >
      <EducationalBackgroundForm
        educationalBackground={isEdit ? educationalBackground : null}
        onSubmit={onSubmit}
        error={error}
        isSubmitting={isSubmitting}
        onClose={onClose}
        universities={universities}
        key={
          isOpen ? `form-${educationalBackground?.id || 'new'}` : 'form-closed'
        }
      />
    </Dialog>
  );
};
