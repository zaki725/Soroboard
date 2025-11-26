import { useState } from 'react';
import toast from 'react-hot-toast';
import type { UseFormSetError } from 'react-hook-form';
import type { EventLocationResponseDto } from '@/types/event-location';
import { apiClient } from '@/libs/api-client';
import { handleFormError } from '@/libs/error-handler';
import { useEventLocationList } from './useEventLocationList';

export type EventLocationFormData = {
  name: string;
};

export const useEventLocationManagement = () => {
  const eventLocationList = useEventLocationList();

  const [editingEventLocation, setEditingEventLocation] =
    useState<EventLocationResponseDto | null>(null);
  const [deletingEventLocation, setDeletingEventLocation] =
    useState<EventLocationResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const startEdit = (eventLocation: EventLocationResponseDto) => {
    setEditingEventLocation(eventLocation);
    setIsEditing(true);
    eventLocationList.setError(null);
  };

  const cancelEdit = () => {
    setEditingEventLocation(null);
    setIsEditing(false);
    eventLocationList.setError(null);
  };

  const startDelete = (eventLocation: EventLocationResponseDto) => {
    setDeletingEventLocation(eventLocation);
    setIsDeleting(true);
    eventLocationList.setError(null);
  };

  const cancelDelete = () => {
    setDeletingEventLocation(null);
    setIsDeleting(false);
    eventLocationList.setError(null);
  };

  const handleUpdate = async (
    data: EventLocationFormData,
    setFormError: UseFormSetError<EventLocationFormData>,
  ) => {
    if (!editingEventLocation) return;

    try {
      setIsSubmitting(true);
      eventLocationList.setError(null);
      await apiClient<EventLocationResponseDto>('/event-locations', {
        method: 'PUT',
        body: {
          id: editingEventLocation.id,
          ...data,
        },
      });

      await eventLocationList.fetchEventLocations();

      setEditingEventLocation(null);
      setIsEditing(false);
      toast.success('ロケーションを更新しました');
    } catch (err) {
      handleFormError(
        err,
        setFormError,
        eventLocationList.setError,
        '更新に失敗しました',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreate = async (
    data: EventLocationFormData,
    setFormError: UseFormSetError<EventLocationFormData>,
  ) => {
    try {
      setIsSubmitting(true);
      eventLocationList.setError(null);
      await apiClient<EventLocationResponseDto>('/event-locations', {
        method: 'POST',
        body: data,
      });

      await eventLocationList.fetchEventLocations();
      setIsCreating(false);
      toast.success('ロケーションを作成しました');
    } catch (err) {
      handleFormError(
        err,
        setFormError,
        eventLocationList.setError,
        '作成に失敗しました',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsSubmitting(true);
      eventLocationList.setError(null);
      await apiClient(`/event-locations/${id}`, {
        method: 'DELETE',
      });

      await eventLocationList.fetchEventLocations();
      setDeletingEventLocation(null);
      setIsDeleting(false);
      toast.success('ロケーションを削除しました');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '削除に失敗しました';
      eventLocationList.setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...eventLocationList,
    editingEventLocation,
    deletingEventLocation,
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
