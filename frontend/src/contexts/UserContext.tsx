'use client';

import { createContext, useContext, useMemo } from 'react';
import { useSWRData } from '@/libs/swr-client';
import type { User } from '@/types/user';

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  mutate: (user?: User) => Promise<User | undefined>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  // TODO: /auth/meエンドポイント実装後に有効化
  // const { data: user, isLoading, mutate } = useSWRData<User>('/auth/me');

  // 一時的な実装：エンドポイント実装までnullを返す（SWRのkeyをnullにすることで呼び出さない）
  const { data: user, isLoading, mutate } = useSWRData<User>(null);

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
