import { z } from 'zod';
import { REQUIRED_FIELD, INVALID } from '../../../common/constants';

export const searchConditionListQuerySchema = z.object({
  formType: z.string().min(1, REQUIRED_FIELD('フォームタイプ')),
  recruitYearId: z
    .string()
    .min(1, REQUIRED_FIELD('年度ID'))
    .transform(Number)
    .refine((val) => !Number.isNaN(val) && val > 0, {
      message: INVALID.RECRUIT_YEAR_ID,
    }),
});

export type SearchConditionListQueryDto = z.infer<
  typeof searchConditionListQuerySchema
>;
