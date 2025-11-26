'use client';

import { useForm, FormProvider } from 'react-hook-form';
import type { UseFormSetError } from 'react-hook-form';
import type { DepartmentFormData } from '../hooks/useDepartmentManagement';
import type { DepartmentResponseDto } from '@/types/department';
import { EditDepartmentFormContent } from './EditDepartmentFormContent';

type EditDepartmentFormProps = {
  department: DepartmentResponseDto;
  onSubmit: (
    data: DepartmentFormData,
    setError: UseFormSetError<DepartmentFormData>,
  ) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
};

export const EditDepartmentForm = ({
  department,
  onSubmit,
  error,
  isSubmitting,
  onClose,
}: EditDepartmentFormProps) => {
  const methods = useForm<DepartmentFormData>({
    defaultValues: {
      name: department.name,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSubmit = methods.handleSubmit((data) => {
    void onSubmit(data, methods.setError);
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <EditDepartmentFormContent
          error={error}
          isSubmitting={isSubmitting}
          onClose={onClose}
        />
      </form>
    </FormProvider>
  );
};
