import type { ReactNode } from 'react';
import type { UserRole } from '@/types/user';
import {
  ApplicantIcon,
  UserManagementIcon,
  LocationIcon,
} from '@/components/ui/icons';

export type NavigationLink = {
  href: string;
  label: string;
  description: string;
  requiredRole: UserRole;
  icon?: ReactNode;
};

export const navigationLinks: NavigationLink[] = [
  {
    href: '/applicants',
    label: '応募者管理',
    description: '応募者情報を管理・確認します',
    requiredRole: 'TEACHER',
    icon: <ApplicantIcon />,
  },
  {
    href: '/students',
    label: '生徒管理',
    description: '生徒一覧を表示します',
    requiredRole: 'TEACHER',
  },
  {
    href: '/admin/user-management',
    label: 'ユーザー管理',
    description: 'ユーザーの検索・作成・編集を行います',
    requiredRole: 'ADMIN',
    icon: <UserManagementIcon />,
  },
  {
    href: '/admin/teachers',
    label: '先生管理',
    description: '先生の一覧を表示します',
    requiredRole: 'ADMIN',
    icon: <UserManagementIcon />,
  },
  {
    href: '/admin/event-location-management',
    label: 'ロケーション管理',
    description: 'ロケーションの一覧を表示します',
    requiredRole: 'ADMIN',
    icon: <LocationIcon />,
  },
];

export const roleCategoryMap: Record<
  UserRole,
  { title: string; description: string }
> = {
  TEACHER: {
    title: '先生向け',
    description: '先生が利用できる機能です',
  },
  ADMIN: {
    title: '管理者向け',
    description: '管理者のみ利用できる機能です',
  },
};

