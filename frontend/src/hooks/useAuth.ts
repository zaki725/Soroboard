import { useUser } from '@/contexts/UserContext';
import type { UserRole } from '@/types/user';

const roleHierarchy: Record<UserRole, number> = {
  user: 1,
  admin: 2,
  master: 3,
};

export const useAuth = () => {
  const { user } = useUser();

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const isMaster = (): boolean => hasRole('master');
  const isAdmin = (): boolean => hasRole('admin');
  const isUser = (): boolean => hasRole('user');

  return {
    user,
    hasRole,
    isMaster,
    isAdmin,
    isUser,
  };
};
