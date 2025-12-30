import { z } from 'zod';
import { REQUIRED_FIELD } from '../../../common/constants';

export const searchConditionListQuerySchema = z.object({
  formType: z.string().min(1, REQUIRED_FIELD('フォームタイプ')),
});

export type SearchConditionListQueryDto = z.infer<
  typeof searchConditionListQuerySchema
>;
