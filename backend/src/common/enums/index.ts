/**
 * ENUM定義ファイル
 * すべてのENUM値はここから取得すること
 */

// ユーザー権限
export type UserRole = 'user' | 'admin' | 'master';
export const USER_ROLES: UserRole[] = ['user', 'admin', 'master'];

// 性別
export type Gender = 'male' | 'female' | 'other';
export const GENDERS: Gender[] = ['male', 'female', 'other'];

// 教育タイプ
export type EducationType =
  | '大学院'
  | '大学'
  | '短期大学'
  | '専門学校'
  | '高等学校'
  | 'その他';
export const EDUCATION_TYPES: EducationType[] = [
  '大学院',
  '大学',
  '短期大学',
  '専門学校',
  '高等学校',
  'その他',
];

// ロケーションタイプ
export type LocationType = 'オンライン' | '対面' | 'オンライン_対面';
export const LOCATION_TYPES: LocationType[] = [
  'オンライン',
  '対面',
  'オンライン_対面',
];

// 先生のロール
export type TeacherRole = 'OWNER' | 'STAFF';
export const TEACHER_ROLES: TeacherRole[] = ['OWNER', 'STAFF'];

// 生徒の在籍状況
export type StudentStatus = 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN';
export const STUDENT_STATUSES: StudentStatus[] = [
  'ACTIVE',
  'SUSPENDED',
  'WITHDRAWN',
];
