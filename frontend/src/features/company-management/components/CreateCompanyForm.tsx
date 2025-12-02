'use client';

import { useForm, FormProvider, type UseFormSetError } from 'react-hook-form';
import type { CompanyFormData } from '../hooks/useCompanyManagement';
import { CreateCompanyFormContent } from './CreateCompanyFormContent';

type CreateCompanyFormProps = {
  recruitYearOptions: Array<{ value: number; label: string }>;
  defaultRecruitYearId?: number;
  onSubmit: (
    data: CompanyFormData,
    setFormError: UseFormSetError<CompanyFormData>,
  ) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
};

export const CreateCompanyForm = ({
  recruitYearOptions,
  defaultRecruitYearId,
  onSubmit,
  error,
  isSubmitting,
  onClose,
}: CreateCompanyFormProps) => {
  const methods = useForm<CompanyFormData>({
    defaultValues: {
      name: '',
      phoneNumber: null,
      email: null,
      websiteUrl: null,
      recruitYearId: defaultRecruitYearId || 0,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    await onSubmit(
      {
        ...data,
        recruitYearId: Number(data.recruitYearId),
        phoneNumber: data.phoneNumber || null,
        email: data.email || null,
        websiteUrl: data.websiteUrl || null,
      },
      methods.setError,
    );
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <CreateCompanyFormContent
          recruitYearOptions={recruitYearOptions}
          error={error}
          isSubmitting={isSubmitting}
          onClose={onClose}
        />
      </form>
    </FormProvider>
  );
};
