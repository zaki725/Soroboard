import { z } from 'zod';
import { REQUIRED_FIELD } from '../../../common/constants';
import { EDUCATION_TYPES, type EducationType } from '../../../common/enums';

export const createEducationalBackgroundRequestSchema = z.object({
  interviewerId: z.string().min(1, REQUIRED_FIELD('面接官ID')),
  educationType: z.enum(
    EDUCATION_TYPES as [EducationType, ...EducationType[]],
    {
      errorMap: () => ({
        message:
          '教育タイプは大学院、大学、短期大学、専門学校、高等学校、その他のいずれかである必要があります',
      }),
    },
  ),
  universityId: z.string().optional(),
  facultyId: z.string().optional(),
  graduationYear: z.number().int().min(1900).max(3000).optional(),
  graduationMonth: z.number().int().min(1).max(12).optional(),
});

export type CreateEducationalBackgroundRequestDto = z.infer<
  typeof createEducationalBackgroundRequestSchema
>;

export const updateEducationalBackgroundRequestSchema = z.object({
  id: z.string().min(1, REQUIRED_FIELD('ID')),
  educationType: z.enum(
    EDUCATION_TYPES as [EducationType, ...EducationType[]],
    {
      errorMap: () => ({
        message:
          '教育タイプは大学院、大学、短期大学、専門学校、高等学校、その他のいずれかである必要があります',
      }),
    },
  ),
  universityId: z.string().optional(),
  facultyId: z.string().optional(),
  graduationYear: z.number().int().min(1900).max(3000).optional(),
  graduationMonth: z.number().int().min(1).max(12).optional(),
});

export type UpdateEducationalBackgroundRequestDto = z.infer<
  typeof updateEducationalBackgroundRequestSchema
>;
