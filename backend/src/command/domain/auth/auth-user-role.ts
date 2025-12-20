/**
 * 認証ユーザーの権限（ドメイン層の定義）
 * PrismaのAuthUserRoleとは独立して定義し、Mapperで変換する
 */
export type AuthUserRole = 'TEACHER' | 'ADMIN';

export const AuthUserRole = {
  TEACHER: 'TEACHER' as const,
  ADMIN: 'ADMIN' as const,
} as const;


