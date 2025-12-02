import type { ReactNode } from 'react';
import type { UserRole } from '@/types/user';
import {
  ApplicantIcon,
  UserManagementIcon,
  RecruitYearIcon,
  CompanyIcon,
  MailIcon,
  InterviewerIcon,
  DepartmentIcon,
  UniversityIcon,
  LocationIcon,
  CalendarIcon,
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
    href: '/mail/management',
    label: 'メール管理',
    description: 'メールの送信・管理を行います',
    requiredRole: 'user',
    icon: <MailIcon />,
  },
  {
    href: '/admin/interviewer-management',
    label: '面接官管理',
    description: '面接官の追加・編集を行います',
    requiredRole: 'admin',
    icon: <InterviewerIcon />,
  },
  {
    href: '/admin/event-management',
    label: 'イベント管理',
    description: 'イベントの追加・編集を行います',
    requiredRole: 'admin',
    icon: <CalendarIcon />,
  },
  {
    href: '/master/recruit-year-management',
    label: '年度管理',
    description: '年度の追加・編集を行います',
    requiredRole: 'master',
    icon: <RecruitYearIcon />,
  },
  {
    href: '/master/user-management',
    label: 'ユーザー管理',
    description: 'ユーザーの追加・編集を行います',
    requiredRole: 'master',
    icon: <UserManagementIcon />,
  },
  {
    href: '/master/company-management',
    label: '会社管理',
    description: '会社の追加・編集を行います',
    requiredRole: 'master',
    icon: <CompanyIcon />,
  },
  {
    href: '/master/department-management',
    label: '部署管理',
    description: '部署の追加・編集を行います',
    requiredRole: 'master',
    icon: <DepartmentIcon />,
  },
  {
    href: '/master/university-management',
    label: '大学管理',
    description: '大学の追加・編集を行います',
    requiredRole: 'master',
    icon: <UniversityIcon />,
  },
  {
    href: '/master/event-location-management',
    label: 'ロケーション管理',
    description: 'ロケーションの追加・編集を行います',
    requiredRole: 'master',
    icon: <LocationIcon />,
  },
  {
    href: '/master/event-master-management',
    label: 'イベントマスター管理',
    description: 'イベントマスターの追加・編集を行います',
    requiredRole: 'master',
    icon: <CalendarIcon />,
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
