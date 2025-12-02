'use client';

import { useForm, FormProvider, type UseFormSetError } from 'react-hook-form';
import type { UniversityFormData } from '../../hooks/useUniversityManagement';
import { CreateUniversityFormContent } from './CreateUniversityFormContent';

type CreateUniversityFormProps = {
  onSubmit: (
    data: UniversityFormData,
    setFormError: UseFormSetError<UniversityFormData>,
  ) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
};

export const CreateUniversityForm = ({
  onSubmit,
  error,
  isSubmitting,
  onClose,
}: CreateUniversityFormProps) => {
  const methods = useForm<UniversityFormData>({
    defaultValues: {
      name: '',
      rank: undefined,
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
        <CreateUniversityFormContent
          error={error}
          isSubmitting={isSubmitting}
          onClose={onClose}
        />
      </form>
    </FormProvider>
  );
};
