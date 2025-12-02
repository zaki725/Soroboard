import { z } from 'zod';
import { REQUIRED_FIELD, INVALID } from '../../../common/constants';

export const companyListQuerySchema = z.object({
  recruitYearId: z
    .string()
    .min(1, REQUIRED_FIELD('年度ID'))
    .transform((val) => Number(val))
    .refine((val) => !Number.isNaN(val) && val > 0, {
      message: INVALID.RECRUIT_YEAR_ID,
    }),
  id: z.string().optional(),
  search: z.string().optional(),
});

export type CompanyListQueryDto = z.infer<typeof companyListQuerySchema>;
