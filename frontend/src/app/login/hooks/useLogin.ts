import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { UseFormSetError } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/libs/api-client';
import { handleFormError } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import { useUser } from '@/contexts/UserContext';
import type { LoginFormData } from '../types/login-form';

type LoginResponse = {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
};

export const useLogin = () => {
  const router = useRouter();
  const { mutate } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (
      data: LoginFormData,
      setFormError: UseFormSetError<LoginFormData>,
    ) => {
      try {
        setIsLoading(true);
        const response = await apiClient<LoginResponse>('/auth/login', {
          method: 'POST',
          body: {
            email: data.email,
            password: data.password,
          },
        });

        if (!response) {
          throw new Error(errorMessages.loginFailed);
        }

        // セッションが確立されたので /auth/me を再取得してユーザー情報を更新
        await mutate();

        router.push('/');
      } catch (err) {
        handleFormError(
          err,
          setFormError,
          (message) => toast.error(message),
          errorMessages.loginFailed,
        );
        return;
      } finally {
        setIsLoading(false);
      }
    },
    [router, mutate],
  );

  return {
    handleSubmit,
    isLoading,
  };
};
