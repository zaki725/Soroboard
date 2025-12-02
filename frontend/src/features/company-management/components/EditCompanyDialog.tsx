'use client';

import { Dialog } from '@/components/ui';
import { useRecruitYear } from '@/contexts/RecruitYearContext';
import type { UseFormSetError } from 'react-hook-form';
import type { CompanyFormData } from '../hooks/useCompanyManagement';
import type { CompanyResponseDto } from '@/types/company';
import { EditCompanyForm } from './EditCompanyForm';

type EditCompanyDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CompanyFormData,
    setError: UseFormSetError<CompanyFormData>,
  ) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  company: CompanyResponseDto | null;
};

export const EditCompanyDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  company,
}: EditCompanyDialogProps) => {
  const { recruitYears } = useRecruitYear();

  if (!company) return null;

  const recruitYearOptions = recruitYears.map((year) => ({
    value: year.recruitYear,
    label: `${year.recruitYear}年度 - ${year.displayName}`,
  }));

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="会社編集" size="md">
      <EditCompanyForm
        company={company}
        recruitYearOptions={recruitYearOptions}
        onSubmit={onSubmit}
        error={error}
        isSubmitting={isSubmitting}
        onClose={onClose}
        key={isOpen ? `form-${company.id}` : 'form-closed'}
      />
    </Dialog>
  );
};
