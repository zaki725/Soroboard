import { useState } from 'react';
import toast from 'react-hot-toast';
import type { UseFormSetError } from 'react-hook-form';
import type { UniversityFormData } from './useUniversityManagement';
import { apiClient } from '@/libs/api-client';
import { handleFormError } from '@/libs/error-handler';
import type {
  UniversityResponseDto,
  UniversityRankLevel,
} from '@/types/university';

export const useUniversityDetailManagement = (
  universityId: string,
  refreshUniversity: () => Promise<void>,
) => {
  const [isEditingUniversity, setIsEditingUniversity] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateUniversity = async (
    data: UniversityFormData,
    setFormError: UseFormSetError<UniversityFormData>,
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await apiClient<UniversityResponseDto>('/universities', {
        method: 'PUT',
        body: {
          id: universityId,
          name: data.name,
          rank:
            data.rank && data.rank !== ''
              ? (data.rank as UniversityRankLevel | undefined)
              : undefined,
        },
      });

      await refreshUniversity();
      setIsEditingUniversity(false);
      toast.success('大学を更新しました');
    } catch (err) {
      handleFormError(err, setFormError, setError, '更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isEditingUniversity,
    setIsEditingUniversity,
    handleUpdateUniversity,
    isSubmitting,
    error,
  };
};
