'use client';

import { useForm, FormProvider, type UseFormSetError } from 'react-hook-form';
import type { DeviationValueFormData } from '../../hooks/useFacultyManagement';
import { CreateDeviationValueFormContent } from './CreateDeviationValueFormContent';

type CreateDeviationValueFormProps = {
  onSubmit: (
    data: DeviationValueFormData,
    setFormError: UseFormSetError<DeviationValueFormData>,
  ) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  facultyId: string;
};

export const CreateDeviationValueForm = ({
  onSubmit,
  error,
  isSubmitting,
  onClose,
  facultyId,
}: CreateDeviationValueFormProps) => {
  const methods = useForm<DeviationValueFormData>({
    defaultValues: {
      facultyId,
      value: 0,
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
        <CreateDeviationValueFormContent
          error={error}
          isSubmitting={isSubmitting}
          onClose={onClose}
        />
      </form>
    </FormProvider>
  );
};
