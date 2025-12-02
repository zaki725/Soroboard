import type { UserRole, Gender } from '@/types/user';
import type { InterviewerCategory } from '@/types/interviewer';
import type { UniversityRankLevel } from '@/types/university';
import { USER_ROLES, GENDERS, INTERVIEWER_CATEGORIES } from '@/constants/enums';
import { UniversityRankLevelValues } from '@/types/university';

/**
 * UserRoleの型ガード
 * URLパラメータから取得した値が有効なUserRoleかどうかをチェック
 */
export const isValidUserRole = (role: string | null): role is UserRole => {
  if (!role) return false;
  return USER_ROLES.includes(role as UserRole);
};

/**
 * Genderの型ガード
 * URLパラメータから取得した値が有効なGenderかどうかをチェック
 */
export const isValidGender = (gender: string | null): gender is Gender => {
  if (!gender) return false;
  return GENDERS.includes(gender as Gender);
};

/**
 * InterviewerCategoryの型ガード
 * URLパラメータから取得した値が有効なInterviewerCategoryかどうかをチェック
 */
export const isValidInterviewerCategory = (
  category: string | null,
): category is InterviewerCategory => {
  if (!category) return false;
  return INTERVIEWER_CATEGORIES.includes(category as InterviewerCategory);
};

/**
 * UniversityRankLevelの型ガード
 * URLパラメータから取得した値が有効なUniversityRankLevelかどうかをチェック
 */
export const isValidUniversityRankLevel = (
  rank: string | null,
): rank is UniversityRankLevel => {
  if (!rank) return false;
  return UniversityRankLevelValues.includes(rank as UniversityRankLevel);
};
