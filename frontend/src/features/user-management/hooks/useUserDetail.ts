import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { UseFormSetError } from 'react-hook-form';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage, handleFormError } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import type { UserResponseDto, UserRole, Gender } from '@/types/user';

type UserFormData = {
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  gender: Gender | '';
  departmentId: string;
};

type UseUserDetailParams = {
  userId: string;
};

export const useUserDetail = ({ userId }: UseUserDetailParams) => {
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient<UserResponseDto>(`/users/${userId}`);
      setUser(data);
    } catch (err) {
      const message = extractErrorMessage(err, errorMessages.userFetchFailed);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleSubmit = useCallback(
    async (data: UserFormData, setFormError: UseFormSetError<UserFormData>) => {
      if (!user) return;

      try {
        setError(null);
        await apiClient<UserResponseDto>(`/users/${user.id}`, {
          method: 'PUT',
          body: {
            email: data.email,
            role: data.role,
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender || null,
            departmentId: data.departmentId,
          },
        });
        await fetchUser();
        toast.success('ユーザーを更新しました');
      } catch (err) {
        handleFormError(
          err,
          setFormError,
          setError,
          errorMessages.userUpdateFailed,
        );
        throw err;
      }
    },
    [user, fetchUser],
  );

  return {
    user,
    isLoading,
    error,
    handleSubmit,
  };
};
