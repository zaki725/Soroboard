import { z } from 'zod';

export const eventListQuerySchema = z.object({
  id: z.string().optional(),
  search: z.string().optional(),
  eventMasterId: z.string().optional(),
  locationId: z.string().optional(),
  interviewerId: z.string().optional(),
  startTimeFrom: z.string().optional(),
  recruitYearId: z
    .string()
    .min(1, '年度IDは必須です')
    .transform((val) => Number(val))
    .refine((val) => !Number.isNaN(val) && val > 0, {
      message: '年度IDは正の整数である必要があります',
    }),
});

export type EventListQueryDto = z.infer<typeof eventListQuerySchema>;
