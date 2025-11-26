'use client';

import { useForm, FormProvider } from 'react-hook-form';
import type { UseFormSetError } from 'react-hook-form';
import type { UniversityFormData } from '../hooks/useUniversityManagement';
import type { UniversityResponseDto } from '@/types/university';
import { EditUniversityFormContent } from './EditUniversityFormContent';

type EditUniversityFormProps = {
  university: UniversityResponseDto;
  onSubmit: (
    data: UniversityFormData,
    setError: UseFormSetError<UniversityFormData>,
  ) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
};

export const EditUniversityForm = ({
  university,
  onSubmit,
  error,
  isSubmitting,
  onClose,
}: EditUniversityFormProps) => {
  const methods = useForm<UniversityFormData>({
    defaultValues: {
      name: university.name,
      rank: university.rank,
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
        <EditUniversityFormContent
          error={error}
          isSubmitting={isSubmitting}
          onClose={onClose}
        />
      </form>
    </FormProvider>
  );
};
