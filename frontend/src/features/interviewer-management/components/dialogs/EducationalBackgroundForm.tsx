'use client';

import { useMemo } from 'react';
import { useForm, FormProvider, type UseFormSetError } from 'react-hook-form';
import type { EducationalBackgroundFormData } from '../../hooks/useEducationalBackgroundManagement';
import { EducationalBackgroundFormContent } from './EducationalBackgroundFormContent';
import type { UniversityResponseDto } from '@/types/university';
import type { EducationalBackgroundResponseDto } from '@/types/educational-background';

type EducationalBackgroundFormProps = {
  educationalBackground?: EducationalBackgroundResponseDto | null;
  onSubmit: (
    data: EducationalBackgroundFormData,
    setError: UseFormSetError<EducationalBackgroundFormData>,
  ) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  universities: UniversityResponseDto[];
};

export const EducationalBackgroundForm = ({
  educationalBackground,
  onSubmit,
  error,
  isSubmitting,
  onClose,
  universities,
}: EducationalBackgroundFormProps) => {
  const defaultValues = useMemo<EducationalBackgroundFormData>(
    () => ({
      educationType: educationalBackground?.educationType || '大学',
      universityId: educationalBackground?.universityId || '',
      facultyId: educationalBackground?.facultyId || '',
      graduationYear:
        educationalBackground?.graduationYear !== undefined &&
        educationalBackground?.graduationYear !== null
          ? educationalBackground.graduationYear.toString()
          : '',
      graduationMonth:
        educationalBackground?.graduationMonth !== undefined &&
        educationalBackground?.graduationMonth !== null
          ? educationalBackground.graduationMonth.toString()
          : '',
    }),
    [educationalBackground],
  );

  const methods = useForm<EducationalBackgroundFormData>({
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    await onSubmit(data, methods.setError);
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <EducationalBackgroundFormContent
          error={error}
          isSubmitting={isSubmitting}
          onClose={onClose}
          universities={universities}
        />
      </form>
    </FormProvider>
  );
};
