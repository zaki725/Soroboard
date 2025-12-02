import { useState, useCallback } from 'react';
import { apiClient } from '@/libs/api-client';
import type { EventMasterResponseDto } from '@/types/event-master';
import { extractErrorMessage } from '@/libs/error-handler';
import toast from 'react-hot-toast';
import type { LocationType } from '@/constants/enums';

export type EventMasterFormData = {
  name: string;
  description: string | null;
  type: LocationType;
  recruitYearId: number;
};

export const useEventMasterManagement = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreate = useCallback(async (data: EventMasterFormData) => {
    setIsCreating(true);
    try {
      await apiClient<EventMasterResponseDto>('/event-masters', {
        method: 'POST',
        body: {
          name: data.name,
          description: data.description,
          type: data.type,
          recruitYearId: data.recruitYearId,
        },
      });
      toast.success('イベントマスターを登録しました');
    } catch (err) {
      const message = extractErrorMessage(
        err,
        'イベントマスターの登録に失敗しました',
      );
      toast.error(message);
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const handleUpdate = useCallback(
    async (id: string, data: EventMasterFormData) => {
      setIsUpdating(true);
      try {
        await apiClient<EventMasterResponseDto>('/event-masters', {
          method: 'PUT',
          body: {
            id,
            name: data.name,
            description: data.description,
            type: data.type,
          },
        });
        toast.success('イベントマスターを更新しました');
      } catch (err) {
        const message = extractErrorMessage(
          err,
          'イベントマスターの更新に失敗しました',
        );
        toast.error(message);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [],
  );

  const handleDelete = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      await apiClient<void>(`/event-masters/${id}`, {
        method: 'DELETE',
      });
      toast.success('イベントマスターを削除しました');
    } catch (err) {
      const message = extractErrorMessage(
        err,
        'イベントマスターの削除に失敗しました',
      );
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
