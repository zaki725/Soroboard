'use client';

import { createContext, useContext, useMemo, useCallback } from 'react';
import { useSWRData } from '@/libs/swr-client';
import type { User } from '@/types/user';

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  mutate: () => Promise<User | undefined>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// バックエンドのLoginResponseDto型（/auth/me のレスポンス）
type LoginResponseDto = {
  id: string;
  email: string;
  role: 'TEACHER' | 'ADMIN';
  firstName: string;
  lastName: string;
};

// LoginResponseDto を User 型に変換（読み取り専用の一方向変換）
const convertToUser = (response: LoginResponseDto): User => {
  return {
    id: response.id,
    name: `${response.lastName} ${response.firstName}`,
    email: response.email,
    role: response.role, // バックエンドのAuthUserRoleとフロントのUserRoleが同じなので変換不要
  };
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    data: response,
    isLoading,
    mutate: mutateResponse,
  } = useSWRData<LoginResponseDto>('/auth/me');

  const user = response ? convertToUser(response) : null;

  // SWR の mutate をそのままラップし、/auth/me を再取得して User 型に変換する
  const mutate = useCallback(async () => {
    return mutateResponse().then((res) =>
      res ? convertToUser(res) : undefined,
    );
  }, [mutateResponse]);

  const value = useMemo(
    () => ({
      user: user ?? null,
      isLoading,
      mutate,
    }),
    [user, isLoading, mutate],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
