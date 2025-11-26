'use client';

import { useForm, FormProvider, type UseFormSetError } from 'react-hook-form';
import type { InterviewerRegistrationFormData } from '../hooks/useInterviewerRegistration';
import { CreateInterviewerFormContent } from './CreateInterviewerFormContent';
import type { UserResponseDto } from '@/types/user';

type CreateInterviewerFormProps = {
  onSubmit: (
    data: InterviewerRegistrationFormData,
    setFormError: UseFormSetError<InterviewerRegistrationFormData>,
  ) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  users: UserResponseDto[];
};

export const CreateInterviewerForm = ({
  onSubmit,
  error,
  isSubmitting,
  onClose,
  users,
}: CreateInterviewerFormProps) => {
  const methods = useForm<InterviewerRegistrationFormData>({
    defaultValues: {
      userId: '',
      category: 'フロント',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    await onSubmit(data, methods.setError);
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <CreateInterviewerFormContent
          error={error}
          isSubmitting={isSubmitting}
          onClose={onClose}
          users={users}
        />
      </form>
    </FormProvider>
  );
};
