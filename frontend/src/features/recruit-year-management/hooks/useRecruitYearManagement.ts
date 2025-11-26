import { useState } from 'react';
import toast from 'react-hot-toast';
import type { UseFormSetError } from 'react-hook-form';
import { useRecruitYear } from '@/contexts/RecruitYearContext';
import type { RecruitYearResponseDto } from '@/types/recruit-year';
import { apiClient } from '@/libs/api-client';
import { handleFormError } from '@/libs/error-handler';

export type RecruitYearFormData = {
  recruitYear: number;
  displayName: string;
  themeColor: string;
};

export const useRecruitYearManagement = () => {
  const {
    recruitYears,
    selectedRecruitYear,
    setSelectedRecruitYear,
    setRecruitYears,
  } = useRecruitYear();
  const [editingYear, setEditingYear] = useState<RecruitYearResponseDto | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const startEdit = (year: RecruitYearResponseDto) => {
    setEditingYear(year);
    setIsEditing(true);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingYear(null);
    setIsEditing(false);
    setError(null);
  };

  const handleUpdate = async (
    data: RecruitYearFormData,
    setFormError: UseFormSetError<RecruitYearFormData>,
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const updated = await apiClient<RecruitYearResponseDto>(
        '/recruit-years',
        {
          method: 'PUT',
          body: data,
        },
      );

      const updatedYears = recruitYears.map((year) =>
        year.recruitYear === updated.recruitYear ? updated : year,
      );
      setRecruitYears(updatedYears);

      if (selectedRecruitYear?.recruitYear === updated.recruitYear) {
        setSelectedRecruitYear(updated);
      }

      setEditingYear(null);
      setIsEditing(false);
      toast.success('年度を更新しました');
    } catch (err) {
      handleFormError(err, setFormError, setError, '更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreate = async (
    data: RecruitYearFormData,
    setFormError: UseFormSetError<RecruitYearFormData>,
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const newYear = await apiClient<RecruitYearResponseDto>(
        '/recruit-years',
        {
          method: 'POST',
          body: data,
        },
      );

      const updatedYears = [...recruitYears, newYear].sort(
        (a, b) => b.recruitYear - a.recruitYear,
      );
      setRecruitYears(updatedYears);
      setIsCreating(false);
      toast.success('年度を作成しました');
    } catch (err) {
      handleFormError(err, setFormError, setError, '作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    editingYear,
    isSubmitting,
    error,
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
