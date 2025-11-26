import { z } from 'zod';
import { REQUIRED_FIELD } from '../../../common/constants';

export const createSearchConditionRequestSchema = z.object({
  formType: z.string().min(1, REQUIRED_FIELD('フォームタイプ')),
  name: z.string().min(1, REQUIRED_FIELD('名前')),
  urlParams: z.string().min(1, REQUIRED_FIELD('URLパラメータ')),
  recruitYearId: z
    .number()
    .int()
    .positive()
    .optional()
    .transform((val) => val ?? undefined),
});

export type CreateSearchConditionRequestDto = z.infer<
  typeof createSearchConditionRequestSchema
>;

export const updateSearchConditionRequestSchema = z.object({
  id: z.string().min(1, REQUIRED_FIELD('ID')),
  name: z.string().min(1, REQUIRED_FIELD('名前')),
});

export type UpdateSearchConditionRequestDto = z.infer<
  typeof updateSearchConditionRequestSchema
>;
