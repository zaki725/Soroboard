import { useState } from 'react';
import toast from 'react-hot-toast';
import type { UseFormSetError } from 'react-hook-form';
import type { EducationalBackgroundResponseDto } from '@/types/educational-background';
import { apiClient } from '@/libs/api-client';
import { handleFormError } from '@/libs/error-handler';

export type EducationalBackgroundFormData = {
  educationType:
    | '大学院'
    | '大学'
    | '短期大学'
    | '専門学校'
    | '高等学校'
    | 'その他';
  universityId?: string;
  facultyId?: string;
  graduationYear?: string | number;
  graduationMonth?: string | number;
};

export const useEducationalBackgroundManagement = (
  interviewerId: string,
  onSuccess: () => void,
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingEducationalBackground, setEditingEducationalBackground] =
    useState<EducationalBackgroundResponseDto | null>(null);
  const [deletingEducationalBackground, setDeletingEducationalBackground] =
    useState<EducationalBackgroundResponseDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (
    data: EducationalBackgroundFormData,
    setFormError: UseFormSetError<EducationalBackgroundFormData>,
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await apiClient<EducationalBackgroundResponseDto>(
        '/educational-backgrounds',
        {
          method: 'POST',
          body: {
            interviewerId,
            educationType: data.educationType,
            universityId: data.universityId || undefined,
            facultyId: data.facultyId || undefined,
            graduationYear:
              data.graduationYear !== undefined &&
              data.graduationYear !== null &&
              data.graduationYear !== ''
                ? Number(data.graduationYear)
                : undefined,
            graduationMonth:
              data.graduationMonth !== undefined &&
              data.graduationMonth !== null &&
              data.graduationMonth !== ''
                ? Number(data.graduationMonth)
                : undefined,
          },
        },
      );

      onSuccess();
      setIsCreating(false);
      toast.success('学歴を登録しました');
    } catch (err) {
      handleFormError(err, setFormError, setError, '登録に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (
    data: EducationalBackgroundFormData,
    setFormError: UseFormSetError<EducationalBackgroundFormData>,
  ) => {
    if (!editingEducationalBackground) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await apiClient<EducationalBackgroundResponseDto>(
        '/educational-backgrounds',
        {
          method: 'PUT',
          body: {
            id: editingEducationalBackground.id,
            educationType: data.educationType,
            universityId: data.universityId || undefined,
            facultyId: data.facultyId || undefined,
            graduationYear:
              data.graduationYear !== undefined &&
              data.graduationYear !== null &&
              data.graduationYear !== ''
                ? Number(data.graduationYear)
                : undefined,
            graduationMonth:
              data.graduationMonth !== undefined &&
              data.graduationMonth !== null &&
              data.graduationMonth !== ''
                ? Number(data.graduationMonth)
                : undefined,
          },
        },
      );

      onSuccess();
      setIsEditing(false);
      setEditingEducationalBackground(null);
      toast.success('学歴を更新しました');
    } catch (err) {
      handleFormError(err, setFormError, setError, '更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await apiClient(`/educational-backgrounds/${id}`, {
        method: 'DELETE',
      });

      onSuccess();
      setIsDeleting(false);
      setDeletingEducationalBackground(null);
      toast.success('学歴を削除しました');
    } catch (err) {
      const errorMessage =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : '削除に失敗しました';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    isCreating,
    setIsCreating,
    isEditing,
    setIsEditing,
    isDeleting,
    setIsDeleting,
    editingEducationalBackground,
    setEditingEducationalBackground,
    deletingEducationalBackground,
    setDeletingEducationalBackground,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};
