import { useState } from 'react';
import toast from 'react-hot-toast';
import type { UseFormSetError } from 'react-hook-form';
import { apiClient } from '@/libs/api-client';
import { handleFormError, extractErrorMessage } from '@/libs/error-handler';
import type {
  InterviewerResponseDto,
  InterviewerCategory,
} from '@/types/interviewer';
import { useInterviewerList } from './useInterviewerList';

export type InterviewerUpdateFormData = {
  category: InterviewerCategory;
};

export const useInterviewerManagement = () => {
  const interviewerList = useInterviewerList();

  const [editingInterviewer, setEditingInterviewer] =
    useState<InterviewerResponseDto | null>(null);
  const [deletingInterviewer, setDeletingInterviewer] =
    useState<InterviewerResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const startEdit = (userId: string) => {
    const interviewer = interviewerList.interviewers.find(
      (i) => i.userId === userId,
    );
    if (interviewer) {
      setEditingInterviewer(interviewer);
      setIsEditing(true);
      interviewerList.setError(null);
    }
  };

  const cancelEdit = () => {
    setEditingInterviewer(null);
    setIsEditing(false);
    interviewerList.setError(null);
  };

  const startDelete = (userId: string) => {
    const interviewer = interviewerList.interviewers.find(
      (i) => i.userId === userId,
    );
    if (interviewer) {
      setDeletingInterviewer(interviewer);
      setIsDeleting(true);
      interviewerList.setError(null);
    }
  };

  const cancelDelete = () => {
    setDeletingInterviewer(null);
    setIsDeleting(false);
    interviewerList.setError(null);
  };

  const handleUpdate = async (
    data: InterviewerUpdateFormData,
    setFormError: UseFormSetError<InterviewerUpdateFormData>,
  ) => {
    if (!editingInterviewer) return;

    try {
      setIsSubmitting(true);
      interviewerList.setError(null);
      await apiClient<InterviewerResponseDto>('/interviewers', {
        method: 'PUT',
        body: {
          userId: editingInterviewer.userId,
          category: data.category,
        },
      });

      await interviewerList.fetchInterviewers();
      setEditingInterviewer(null);
      setIsEditing(false);
      toast.success('面接官を更新しました');
    } catch (err) {
      handleFormError(
        err,
        setFormError,
        interviewerList.setError,
        '更新に失敗しました',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      setIsSubmitting(true);
      interviewerList.setError(null);
      await apiClient(`/interviewers/${userId}`, {
        method: 'DELETE',
      });

      await interviewerList.fetchInterviewers();
      setDeletingInterviewer(null);
      setIsDeleting(false);
      toast.success('面接官を削除しました');
    } catch (err) {
      const errorMessage = extractErrorMessage(err, '削除に失敗しました');
      interviewerList.setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...interviewerList,
    editingInterviewer,
    deletingInterviewer,
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
    handleDelete,
  };
};
