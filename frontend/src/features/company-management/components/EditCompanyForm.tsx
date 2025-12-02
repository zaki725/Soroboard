'use client';

import { useForm, FormProvider } from 'react-hook-form';
import type { UseFormSetError } from 'react-hook-form';
import type { CompanyFormData } from '../hooks/useCompanyManagement';
import type { CompanyResponseDto } from '@/types/company';
import { EditCompanyFormContent } from './EditCompanyFormContent';

type EditCompanyFormProps = {
  company: CompanyResponseDto;
  recruitYearOptions: Array<{ value: number; label: string }>;
  onSubmit: (
    data: CompanyFormData,
    setError: UseFormSetError<CompanyFormData>,
  ) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
};

export const EditCompanyForm = ({
  company,
  recruitYearOptions,
  onSubmit,
  error,
  isSubmitting,
  onClose,
}: EditCompanyFormProps) => {
  const methods = useForm<CompanyFormData>({
    defaultValues: {
      name: company.name,
      phoneNumber: company.phoneNumber,
      email: company.email,
      websiteUrl: company.websiteUrl,
      recruitYearId: company.recruitYearId,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSubmit = methods.handleSubmit((data) => {
    void onSubmit(
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
        <EditCompanyFormContent
          error={error}
          isSubmitting={isSubmitting}
          onClose={onClose}
          recruitYearOptions={recruitYearOptions}
        />
      </form>
    </FormProvider>
  );
};
