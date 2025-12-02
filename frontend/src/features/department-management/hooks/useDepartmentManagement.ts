import { useState } from 'react';
import toast from 'react-hot-toast';
import type { UseFormSetError } from 'react-hook-form';
import type { DepartmentResponseDto } from '@/types/department';
import { apiClient } from '@/libs/api-client';
import { handleFormError } from '@/libs/error-handler';
import { useDepartmentList } from './useDepartmentList';

export type DepartmentFormData = {
  name: string;
};

export const useDepartmentManagement = () => {
  const departmentList = useDepartmentList();

  const [editingDepartment, setEditingDepartment] =
    useState<DepartmentResponseDto | null>(null);
  const [deletingDepartment, setDeletingDepartment] =
    useState<DepartmentResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const startEdit = (department: DepartmentResponseDto) => {
    setEditingDepartment(department);
    setIsEditing(true);
    departmentList.setError(null);
  };

  const cancelEdit = () => {
    setEditingDepartment(null);
    setIsEditing(false);
    departmentList.setError(null);
  };

  const startDelete = (department: DepartmentResponseDto) => {
    setDeletingDepartment(department);
    setIsDeleting(true);
    departmentList.setError(null);
  };

  const cancelDelete = () => {
    setDeletingDepartment(null);
    setIsDeleting(false);
    departmentList.setError(null);
  };

  const handleUpdate = async (
    data: DepartmentFormData,
    setFormError: UseFormSetError<DepartmentFormData>,
  ) => {
    if (!editingDepartment) return;

    try {
      setIsSubmitting(true);
      departmentList.setError(null);
      await apiClient<DepartmentResponseDto>('/departments', {
        method: 'PUT',
        body: {
          id: editingDepartment.id,
          ...data,
        },
      });

      await departmentList.fetchDepartments();

      setEditingDepartment(null);
      setIsEditing(false);
      toast.success('部署を更新しました');
    } catch (err) {
      handleFormError(
        err,
        setFormError,
        departmentList.setError,
        '更新に失敗しました',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreate = async (
    data: DepartmentFormData,
    setFormError: UseFormSetError<DepartmentFormData>,
  ) => {
    try {
      setIsSubmitting(true);
      departmentList.setError(null);
      await apiClient<DepartmentResponseDto>('/departments', {
        method: 'POST',
        body: data,
      });

      await departmentList.fetchDepartments();
      setIsCreating(false);
      toast.success('部署を作成しました');
    } catch (err) {
      handleFormError(
        err,
        setFormError,
        departmentList.setError,
        '作成に失敗しました',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsSubmitting(true);
      departmentList.setError(null);
      await apiClient(`/departments/${id}`, {
        method: 'DELETE',
      });

      await departmentList.fetchDepartments();
      setDeletingDepartment(null);
      setIsDeleting(false);
      toast.success('部署を削除しました');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '削除に失敗しました';
      departmentList.setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...departmentList,
    editingDepartment,
    deletingDepartment,
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
