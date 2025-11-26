'use client';

import { useForm, FormProvider, type UseFormSetError } from 'react-hook-form';
import type { UpdateFacultyFormData } from '../hooks/useFacultyManagement';
import { EditFacultyFormContent } from './EditFacultyFormContent';
import type { FacultyResponseDto } from '@/types/faculty';

type EditFacultyFormProps = {
  faculty: FacultyResponseDto;
  onSubmit: (
    data: UpdateFacultyFormData,
    setError: UseFormSetError<UpdateFacultyFormData>,
  ) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
};

export const EditFacultyForm = ({
  faculty,
  onSubmit,
  error,
  isSubmitting,
  onClose,
}: EditFacultyFormProps) => {
  const methods = useForm<UpdateFacultyFormData>({
    defaultValues: {
      id: faculty.id,
      name: faculty.name,
      deviationValue: faculty.deviationValue?.value,
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
        <EditFacultyFormContent
          error={error}
          isSubmitting={isSubmitting}
          onClose={onClose}
        />
      </form>
    </FormProvider>
  );
};
