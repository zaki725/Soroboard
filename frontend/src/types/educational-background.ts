// バックエンドから型をインポート
// TODO: Swaggerから型を自動生成するか、バックエンドの型定義を直接インポートする
export type EducationType =
  | '大学院'
  | '大学'
  | '短期大学'
  | '専門学校'
  | '高等学校'
  | 'その他';

export type EducationalBackgroundResponseDto = {
  id: string;
  interviewerId: string;
  educationType: EducationType;
  universityId?: string;
  universityName?: string;
  facultyId?: string;
  facultyName?: string;
  graduationYear?: number;
  graduationMonth?: number;
};

export type CreateEducationalBackgroundRequestDto = {
  interviewerId: string;
  educationType: EducationType;
  universityId?: string;
  facultyId?: string;
  graduationYear?: number;
  graduationMonth?: number;
};

export type UpdateEducationalBackgroundRequestDto = {
  id: string;
  educationType: EducationType;
  universityId?: string;
  facultyId?: string;
  graduationYear?: number;
  graduationMonth?: number;
};

export type EducationalBackgroundListResponseDto = {
  educationalBackgrounds: EducationalBackgroundResponseDto[];
};
