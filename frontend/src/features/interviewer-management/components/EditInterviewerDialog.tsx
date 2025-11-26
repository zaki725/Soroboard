'use client';

import { Dialog } from '@/components/ui';
import type { UseFormSetError } from 'react-hook-form';
import type { InterviewerUpdateFormData } from '../hooks/useInterviewerManagement';
import type { InterviewerResponseDto } from '@/types/interviewer';
import { EditInterviewerForm } from './EditInterviewerForm';
import type { DepartmentResponseDto } from '@/types/department';

type EditInterviewerDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: InterviewerUpdateFormData,
    setError: UseFormSetError<InterviewerUpdateFormData>,
  ) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  interviewer: InterviewerResponseDto | null;
  departments: DepartmentResponseDto[];
};

export const EditInterviewerDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  interviewer,
  departments,
}: EditInterviewerDialogProps) => {
  if (!interviewer) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="面接官編集" size="md">
      <EditInterviewerForm
        interviewer={interviewer}
        onSubmit={onSubmit}
        error={error}
        isSubmitting={isSubmitting}
        onClose={onClose}
        departments={departments}
        key={isOpen ? `form-${interviewer.userId}` : 'form-closed'}
      />
    </Dialog>
  );
};
