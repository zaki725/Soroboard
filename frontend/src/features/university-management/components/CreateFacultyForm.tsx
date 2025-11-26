'use client';

import { useForm, FormProvider, type UseFormSetError } from 'react-hook-form';
import type { FacultyFormData } from '../hooks/useFacultyManagement';
import { CreateFacultyFormContent } from './CreateFacultyFormContent';

type CreateFacultyFormProps = {
  onSubmit: (
    data: FacultyFormData,
    setFormError: UseFormSetError<FacultyFormData>,
  ) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  universityId: string;
};

export const CreateFacultyForm = ({
  onSubmit,
  error,
  isSubmitting,
  onClose,
  universityId,
}: CreateFacultyFormProps) => {
  const methods = useForm<FacultyFormData>({
    defaultValues: {
      name: '',
      universityId,
      deviationValue: undefined,
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
        <CreateFacultyFormContent
          error={error}
          isSubmitting={isSubmitting}
          onClose={onClose}
        />
      </form>
    </FormProvider>
  );
};
