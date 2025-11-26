'use client';

import { createContext, useContext, useState, useMemo } from 'react';
import type { User } from '@/types/user';

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// スタブデータ: 実際のAPI呼び出しに置き換える
const STUB_USER: User = {
  id: '1',
  name: '山田太郎',
  email: 'yamada@example.com',
  role: 'master',
  // imageUrl: "/rcdx_logo.png",
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(STUB_USER);
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
