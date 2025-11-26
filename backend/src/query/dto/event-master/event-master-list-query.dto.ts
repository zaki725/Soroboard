import { z } from 'zod';

export const eventMasterListQuerySchema = z.object({
  id: z.string().optional(),
  search: z.string().optional(),
  recruitYearId: z
    .string()
    .min(1, '年度IDは必須です')
    .transform((val) => Number(val))
    .refine((val) => !Number.isNaN(val) && val > 0, {
      message: '年度IDは正の整数である必要があります',
    }),
  type: z.string().optional(),
});

export type EventMasterListQueryDto = z.infer<
  typeof eventMasterListQuerySchema
>;
