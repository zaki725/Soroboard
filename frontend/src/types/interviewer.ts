// 型定義は constants/enums から再エクスポート
import type { InterviewerCategory } from '@/constants/enums';
export type { InterviewerCategory } from '@/constants/enums';
export { INTERVIEWER_CATEGORIES } from '@/constants/enums';

export type InterviewerResponseDto = {
  userId: string;
  category: InterviewerCategory;
  userName: string;
  userEmail: string;
  universityId?: string;
  universityName?: string;
  facultyId?: string;
  facultyName?: string;
};

export type CreateInterviewerRequestDto = {
  userId: string;
  category: InterviewerCategory;
  universityId?: string;
  facultyId?: string;
};

export type UpdateInterviewerRequestDto = {
  userId: string;
  category: InterviewerCategory;
  universityId?: string;
  facultyId?: string;
};

export type InterviewerListResponseDto = {
  interviewers: InterviewerResponseDto[];
};
