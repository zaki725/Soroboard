import { useUser } from '@/contexts/UserContext';
import type { UserRole } from '@/types/user';

const roleHierarchy: Record<UserRole, number> = {
  TEACHER: 1,
  ADMIN: 2,
};

export const useAuth = () => {
  const { user, isLoading } = useUser();

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const isAdmin = (): boolean => hasRole('ADMIN');
  const isTeacher = (): boolean => hasRole('TEACHER');

  return {
    user,
    isLoading,
    hasRole,
    isAdmin,
    isTeacher,
  };
};
