import { useState } from 'react';
import toast from 'react-hot-toast';
import type { UseFormSetError } from 'react-hook-form';
import type { FacultyResponseDto } from '@/types/faculty';
import { apiClient } from '@/libs/api-client';
import { handleFormError } from '@/libs/error-handler';

export type FacultyFormData = {
  name: string;
  universityId: string;
  deviationValue?: string | number;
};

export type UpdateFacultyFormData = {
  id: string;
  name: string;
  deviationValue?: string | number;
};

export type DeviationValueFormData = {
  facultyId: string;
  value: number;
};

export const useFacultyManagement = (
  universityId: string,
  onSuccess: () => void,
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingFaculty, setIsCreatingFaculty] = useState(false);
  const [isCreatingDeviationValue, setIsCreatingDeviationValue] =
    useState(false);
  const [isEditingFaculty, setIsEditingFaculty] = useState(false);
  const [isDeletingFaculty, setIsDeletingFaculty] = useState(false);
  const [editingFaculty, setEditingFaculty] =
    useState<FacultyResponseDto | null>(null);
  const [deletingFaculty, setDeletingFaculty] =
    useState<FacultyResponseDto | null>(null);
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleCreateFaculty = async (
    data: FacultyFormData,
    setFormError: UseFormSetError<FacultyFormData>,
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await apiClient<FacultyResponseDto>('/faculties', {
        method: 'POST',
        body: {
          name: data.name,
          universityId: data.universityId,
          deviationValue:
            data.deviationValue !== undefined &&
            data.deviationValue !== null &&
            data.deviationValue !== ''
              ? Number(data.deviationValue)
              : undefined,
        },
      });

      onSuccess();
      setIsCreatingFaculty(false);
      toast.success('学部を作成しました');
    } catch (err) {
      handleFormError(err, setFormError, setError, '作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateDeviationValue = async (
    data: DeviationValueFormData,
    setFormError: UseFormSetError<DeviationValueFormData>,
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await apiClient('/deviation-values', {
        method: 'POST',
        body: data,
      });

      onSuccess();
      setIsCreatingDeviationValue(false);
      setSelectedFacultyId(null);
      toast.success('偏差値を登録しました');
    } catch (err) {
      handleFormError(err, setFormError, setError, '登録に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateFaculty = async (
    data: UpdateFacultyFormData,
    setFormError: UseFormSetError<UpdateFacultyFormData>,
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await apiClient<FacultyResponseDto>('/faculties', {
        method: 'PUT',
        body: {
          id: data.id,
          name: data.name,
          deviationValue:
            data.deviationValue !== undefined &&
            data.deviationValue !== null &&
            data.deviationValue !== ''
              ? Number(data.deviationValue)
              : undefined,
        },
      });

      onSuccess();
      setIsEditingFaculty(false);
      setEditingFaculty(null);
      toast.success('学部を更新しました');
    } catch (err) {
      handleFormError(err, setFormError, setError, '更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFaculty = async (facultyId: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await apiClient(`/faculties/${facultyId}`, {
        method: 'DELETE',
      });

      onSuccess();
      setIsDeletingFaculty(false);
      setDeletingFaculty(null);
      toast.success('学部を削除しました');
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
    isCreatingFaculty,
    setIsCreatingFaculty,
    isCreatingDeviationValue,
    setIsCreatingDeviationValue,
    isEditingFaculty,
    setIsEditingFaculty,
    isDeletingFaculty,
    setIsDeletingFaculty,
    editingFaculty,
    setEditingFaculty,
    deletingFaculty,
    setDeletingFaculty,
    selectedFacultyId,
    setSelectedFacultyId,
    handleCreateFaculty,
    handleUpdateFaculty,
    handleDeleteFaculty,
    handleCreateDeviationValue,
  };
};
