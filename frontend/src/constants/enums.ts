/**
 * ENUM定義ファイル
 * すべてのENUM値はここから取得すること
 */

// 面接官カテゴリ
export type InterviewerCategory = 'フロント' | '現場社員';
export const INTERVIEWER_CATEGORIES: InterviewerCategory[] = [
  'フロント',
  '現場社員',
];

// ユーザー権限（バックエンドのAuthUserRoleと統一）
export type UserRole = 'TEACHER' | 'ADMIN';
export const USER_ROLES: UserRole[] = ['TEACHER', 'ADMIN'];

// 性別
export type Gender = 'male' | 'female' | 'other';
export const GENDERS: Gender[] = ['male', 'female', 'other'];

// ロケーションタイプ
export type LocationType = 'オンライン' | '対面' | 'オンライン_対面';
export const LOCATION_TYPES: LocationType[] = [
  'オンライン',
  '対面',
  'オンライン_対面',
];
