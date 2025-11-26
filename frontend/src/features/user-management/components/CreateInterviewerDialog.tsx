'use client';

import { Dialog } from '@/components/ui';
import type { UseFormSetError } from 'react-hook-form';
import type { InterviewerRegistrationFormData } from '../hooks/useInterviewerRegistration';
import { CreateInterviewerForm } from './CreateInterviewerForm';
import type { UserResponseDto } from '@/types/user';

type CreateInterviewerDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: InterviewerRegistrationFormData,
    setFormError: UseFormSetError<InterviewerRegistrationFormData>,
  ) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  users: UserResponseDto[];
};

export const CreateInterviewerDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  users,
}: CreateInterviewerDialogProps) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="面接官登録" size="md">
      <CreateInterviewerForm
        onSubmit={onSubmit}
        error={error}
        isSubmitting={isSubmitting}
        onClose={onClose}
        users={users}
        key={isOpen ? 'form-open' : 'form-closed'}
      />
    </Dialog>
  );
};
