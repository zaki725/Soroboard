import { useState } from 'react';
import toast from 'react-hot-toast';
import type { UseFormSetError } from 'react-hook-form';
import type {
  UniversityResponseDto,
  UniversityRankLevel,
} from '@/types/university';
import { apiClient } from '@/libs/api-client';
import { handleFormError } from '@/libs/error-handler';
import { useUniversityList } from './useUniversityList';
import { useUniversityCsv } from './useUniversityCsv';

export type UniversityFormData = {
  name: string;
  rank?: string;
};

export const useUniversityManagement = () => {
  const universityList = useUniversityList();
  const csv = useUniversityCsv({
    searchParams: universityList.searchParams,
    fetchUniversities: universityList.fetchUniversities,
  });

  const [editingUniversity, setEditingUniversity] =
    useState<UniversityResponseDto | null>(null);
  const [deletingUniversity, setDeletingUniversity] =
    useState<UniversityResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const startEdit = (university: UniversityResponseDto) => {
    setEditingUniversity(university);
    setIsEditing(true);
    universityList.setError(null);
  };

  const cancelEdit = () => {
    setEditingUniversity(null);
    setIsEditing(false);
    universityList.setError(null);
  };

  const startDelete = (university: UniversityResponseDto) => {
    setDeletingUniversity(university);
    setIsDeleting(true);
    universityList.setError(null);
  };

  const cancelDelete = () => {
    setDeletingUniversity(null);
    setIsDeleting(false);
    universityList.setError(null);
  };

  const handleUpdate = async (
    data: UniversityFormData,
    setFormError: UseFormSetError<UniversityFormData>,
  ) => {
    if (!editingUniversity) return;

    try {
      setIsSubmitting(true);
      universityList.setError(null);
      await apiClient<UniversityResponseDto>('/universities', {
        method: 'PUT',
        body: {
          id: editingUniversity.id,
          ...data,
          rank:
            data.rank && data.rank !== ''
              ? (data.rank as UniversityRankLevel | undefined)
              : undefined,
        },
      });

      await universityList.fetchUniversities();

      setEditingUniversity(null);
      setIsEditing(false);
      toast.success('大学を更新しました');
    } catch (err) {
      handleFormError(
        err,
        setFormError,
        universityList.setError,
        '更新に失敗しました',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreate = async (
    data: UniversityFormData,
    setFormError: UseFormSetError<UniversityFormData>,
  ) => {
    try {
      setIsSubmitting(true);
      universityList.setError(null);
      await apiClient<UniversityResponseDto>('/universities', {
        method: 'POST',
        body: {
          ...data,
          rank:
            data.rank && data.rank !== ''
              ? (data.rank as UniversityRankLevel | undefined)
              : undefined,
        },
      });

      await universityList.fetchUniversities();
      setIsCreating(false);
      toast.success('大学を作成しました');
    } catch (err) {
      handleFormError(
        err,
        setFormError,
        universityList.setError,
        '作成に失敗しました',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsSubmitting(true);
      universityList.setError(null);
      await apiClient(`/universities/${id}`, {
        method: 'DELETE',
      });

      await universityList.fetchUniversities();
      setDeletingUniversity(null);
      setIsDeleting(false);
      toast.success('大学を削除しました');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '削除に失敗しました';
      universityList.setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...universityList,
    ...csv,
    editingUniversity,
    deletingUniversity,
    isSubmitting,
    isCreating,
    setIsCreating,
    isEditing,
    setIsEditing,
    isDeleting,
    setIsDeleting,
    startEdit,
    startDelete,
    cancelEdit,
    cancelDelete,
    handleUpdate,
    handleCreate,
    handleDelete,
  };
};
