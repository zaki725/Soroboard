'use client';

import { useForm, FormProvider, type UseFormSetError } from 'react-hook-form';
import type { InterviewerUpdateFormData } from '../../hooks/useInterviewerManagement';
import type { InterviewerResponseDto } from '@/types/interviewer';
import { EditInterviewerFormContent } from './EditInterviewerFormContent';
import type { DepartmentResponseDto } from '@/types/department';

type EditInterviewerFormProps = {
  interviewer: InterviewerResponseDto;
  onSubmit: (
    data: InterviewerUpdateFormData,
    setError: UseFormSetError<InterviewerUpdateFormData>,
  ) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  departments: DepartmentResponseDto[];
};

export const EditInterviewerForm = ({
  interviewer,
  onSubmit,
  error,
  isSubmitting,
  onClose,
  departments,
}: EditInterviewerFormProps) => {
  const methods = useForm<InterviewerUpdateFormData>({
    defaultValues: {
      category: interviewer.category,
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
        <EditInterviewerFormContent
          error={error}
          isSubmitting={isSubmitting}
          onClose={onClose}
          departments={departments}
        />
      </form>
    </FormProvider>
  );
};
