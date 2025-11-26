import { z } from 'zod';
import { REQUIRED_FIELD, INVALID } from '../../../common/constants';

export type UpdateRecruitYearRequestDto = {
  recruitYear: number;
  displayName: string;
  themeColor: string;
};

export type CreateRecruitYearRequestDto = {
  recruitYear: number;
  displayName: string;
  themeColor: string;
};

const recruitYearRequestSchemaObject = {
  recruitYear: z.number().int().positive(),
  displayName: z.string().min(1, REQUIRED_FIELD('表示名')),
  themeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, INVALID.THEME_COLOR),
};

export const updateRecruitYearRequestSchema = z.object(
  recruitYearRequestSchemaObject,
);

export const createRecruitYearRequestSchema = z.object(
  recruitYearRequestSchemaObject,
);
