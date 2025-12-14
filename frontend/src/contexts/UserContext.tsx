'use client';

import { createContext, useContext, useState, useMemo } from 'react';
import type { User } from '@/types/user';

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  // ログイン前はnull、ログイン後はログインAPIから取得したユーザー情報を設定
  const [user, setUser] = useState<User | null>(null);
  const [isLoading] = useState(false);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isLoading,
    }),
    [user, isLoading],
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
