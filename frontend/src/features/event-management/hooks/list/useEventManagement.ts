import { useState, useCallback } from 'react';
import { apiClient } from '@/libs/api-client';
import type { EventResponseDto } from '@/types/event';
import { extractErrorMessage } from '@/libs/error-handler';
import toast from 'react-hot-toast';
import type { EventFormData } from '@/types/event';
import { convertDateTimeLocalToISO } from '@/libs/date-utils';

export const useEventManagement = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreate = useCallback(async (data: EventFormData) => {
    setIsCreating(true);
    try {
      // startTimeとendTimeをISO形式のDateTime文字列に変換
      const startTimeISO = convertDateTimeLocalToISO(data.startTime);
      const endTimeISO = convertDateTimeLocalToISO(data.endTime);

      if (!startTimeISO) {
        throw new Error('開始日時は必須です');
      }

      await apiClient<EventResponseDto>('/events', {
        method: 'POST',
        body: {
          startTime: startTimeISO,
          endTime: endTimeISO,
          notes: data.notes || null,
          eventMasterId: data.eventMasterId,
          locationId: data.locationId,
          address: data.address || null,
          interviewerIds: data.interviewerIds || [],
        },
      });
      toast.success('イベントを登録しました');
    } catch (err) {
      const message = extractErrorMessage(err, 'イベントの登録に失敗しました');
      toast.error(message);
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const handleUpdate = useCallback(async (id: string, data: EventFormData) => {
    setIsUpdating(true);
    try {
      // startTimeとendTimeをISO形式のDateTime文字列に変換
      const startTimeISO = convertDateTimeLocalToISO(data.startTime);
      const endTimeISO = convertDateTimeLocalToISO(data.endTime);

      if (!startTimeISO) {
        throw new Error('開始日時は必須です');
      }

      await apiClient<EventResponseDto>('/events', {
        method: 'PUT',
        body: {
          id,
          startTime: startTimeISO,
          endTime: endTimeISO,
          notes: data.notes || null,
          locationId: data.locationId,
          address: data.address || null,
          interviewerIds: data.interviewerIds || [],
        },
      });
      toast.success('イベントを更新しました');
    } catch (err) {
      const message = extractErrorMessage(err, 'イベントの更新に失敗しました');
      toast.error(message);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      await apiClient<void>(`/events/${id}`, {
        method: 'DELETE',
      });
      toast.success('イベントを削除しました');
    } catch (err) {
      const message = extractErrorMessage(err, 'イベントの削除に失敗しました');
      toast.error(message);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    isCreating,
    isUpdating,
    isDeleting,
  };
};
