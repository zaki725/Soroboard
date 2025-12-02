'use client';

import { Dialog } from '@/components/ui';
import { useRecruitYear } from '@/contexts/RecruitYearContext';
import type { UseFormSetError } from 'react-hook-form';
import type { CompanyFormData } from '../hooks/useCompanyManagement';
import { CreateCompanyForm } from './CreateCompanyForm';

type CreateCompanyDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CompanyFormData,
    setFormError: UseFormSetError<CompanyFormData>,
  ) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
};

export const CreateCompanyDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: CreateCompanyDialogProps) => {
  const { recruitYears, selectedRecruitYear } = useRecruitYear();

  const recruitYearOptions = recruitYears.map((year) => ({
    value: year.recruitYear,
    label: `${year.recruitYear}年度 - ${year.displayName}`,
  }));

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="新規会社登録" size="md">
      <CreateCompanyForm
        recruitYearOptions={recruitYearOptions}
        defaultRecruitYearId={selectedRecruitYear?.recruitYear}
        onSubmit={onSubmit}
        error={error}
        isSubmitting={isSubmitting}
        onClose={onClose}
        key={isOpen ? 'form-open' : 'form-closed'}
      />
    </Dialog>
  );
};
