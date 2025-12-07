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
  icon?: ReactNode; // オプショナル: サイドメニュー用
};

// ダッシュボードとナビゲーションメニュー用のリンク（説明付き）
export const navigationLinks: NavigationLink[] = [
  {
    href: '/applicants',
    label: '応募者検索',
    description: '応募者情報を検索・閲覧します',
    requiredRole: 'user',
    icon: <ApplicantIcon />,
  },
  {
    href: '/master/user-management',
    label: 'ユーザー管理',
    description: 'ユーザーの追加・編集を行います',
    requiredRole: 'master',
    icon: <UserManagementIcon />,
  },
  {
    href: '/master/teachers',
    label: '先生管理',
    description: '先生の追加・編集を行います',
    requiredRole: 'master',
    icon: <UserManagementIcon />,
  },
  {
    href: '/master/event-location-management',
    label: 'ロケーション管理',
    description: 'ロケーションの追加・編集を行います',
    requiredRole: 'master',
    icon: <LocationIcon />,
  },
];

export const roleCategoryMap: Record<
  UserRole,
  { title: string; description: string }
> = {
  user: {
    title: '一般機能',
    description: '一般ユーザーが利用できる機能',
  },
  admin: {
    title: '管理機能',
    description: '管理者が利用できる機能',
  },
  master: {
    title: 'マスター機能',
    description: 'マスターが利用できる機能',
  },
};
