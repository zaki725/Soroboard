'use client';

import { useForm, FormProvider, type UseFormSetError } from 'react-hook-form';
import type { DepartmentFormData } from '../hooks/useDepartmentManagement';
import { CreateDepartmentFormContent } from './CreateDepartmentFormContent';

type CreateDepartmentFormProps = {
  onSubmit: (
    data: DepartmentFormData,
    setFormError: UseFormSetError<DepartmentFormData>,
  ) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
};

export const CreateDepartmentForm = ({
  onSubmit,
  error,
  isSubmitting,
  onClose,
}: CreateDepartmentFormProps) => {
  const methods = useForm<DepartmentFormData>({
    defaultValues: {
      name: '',
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
        <CreateDepartmentFormContent
          error={error}
          isSubmitting={isSubmitting}
          onClose={onClose}
        />
      </form>
    </FormProvider>
  );
};
