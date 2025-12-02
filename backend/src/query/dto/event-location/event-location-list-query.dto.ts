import { z } from 'zod';

export const eventLocationListQuerySchema = z.object({
  id: z.string().optional(),
  search: z.string().optional(),
});

export type EventLocationListQueryDto = z.infer<
  typeof eventLocationListQuerySchema
>;
