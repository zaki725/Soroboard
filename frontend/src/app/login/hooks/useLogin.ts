import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { UseFormSetError } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/libs/api-client';
import { handleFormError } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import { useUser } from '@/contexts/UserContext';
import type { LoginFormData } from '../types/login-form';
import type { User } from '@/types/user';

type LoginResponse = {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
};

export const useLogin = () => {
  const router = useRouter();
  const { setUser } = useUser();
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

        // UserContextを更新
        const user: User = {
          id: response.id,
          name: `${response.lastName} ${response.firstName}`,
          email: response.email,
          role: response.role as User['role'],
        };
        setUser(user);

        router.push('/');
      } catch (err) {
        handleFormError(
          err,
          setFormError,
          (message) => toast.error(message),
          errorMessages.loginFailed,
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router, setUser],
  );

  return {
    handleSubmit,
    isLoading,
  };
};
