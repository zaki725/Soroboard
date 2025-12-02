import { useState } from 'react';
import toast from 'react-hot-toast';
import type { UseFormSetError } from 'react-hook-form';
import type { CompanyResponseDto } from '@/types/company';
import { apiClient } from '@/libs/api-client';
import { handleFormError } from '@/libs/error-handler';
import { useCompanyList } from './useCompanyList';
import { useCompanyCsv } from './useCompanyCsv';

export type CompanyFormData = {
  name: string;
  phoneNumber: string | null;
  email: string | null;
  websiteUrl: string | null;
  recruitYearId: number;
};

export const useCompanyManagement = () => {
  const companyList = useCompanyList();
  const companyCsv = useCompanyCsv({
    searchParams: companyList.searchParams,
    fetchCompanies: companyList.fetchCompanies,
    selectedRecruitYearId: companyList.selectedRecruitYearId,
  });

  const [editingCompany, setEditingCompany] =
    useState<CompanyResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const startEdit = (company: CompanyResponseDto) => {
    setEditingCompany(company);
    setIsEditing(true);
    companyList.setError(null);
  };

  const cancelEdit = () => {
    setEditingCompany(null);
    setIsEditing(false);
    companyList.setError(null);
  };

  const handleUpdate = async (
    data: CompanyFormData,
    setFormError: UseFormSetError<CompanyFormData>,
  ) => {
    if (!editingCompany) return;

    try {
      setIsSubmitting(true);
      companyList.setError(null);
      await apiClient<CompanyResponseDto>('/companies', {
        method: 'PUT',
        body: {
          id: editingCompany.id,
          ...data,
        },
      });

      await companyList.fetchCompanies();

      setEditingCompany(null);
      setIsEditing(false);
      toast.success('会社を更新しました');
    } catch (err) {
      handleFormError(
        err,
        setFormError,
        companyList.setError,
        '更新に失敗しました',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreate = async (
    data: CompanyFormData,
    setFormError: UseFormSetError<CompanyFormData>,
  ) => {
    try {
      setIsSubmitting(true);
      companyList.setError(null);
      await apiClient<CompanyResponseDto>('/companies', {
        method: 'POST',
        body: data,
      });

      await companyList.fetchCompanies();
      setIsCreating(false);
      toast.success('会社を作成しました');
    } catch (err) {
      handleFormError(
        err,
        setFormError,
        companyList.setError,
        '作成に失敗しました',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...companyList,
    ...companyCsv,
    editingCompany,
    isSubmitting,
    isCreating,
    setIsCreating,
    isEditing,
    setIsEditing,
    startEdit,
    cancelEdit,
    handleUpdate,
    handleCreate,
  };
};
