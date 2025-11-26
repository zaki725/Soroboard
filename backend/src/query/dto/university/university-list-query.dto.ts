import { z } from 'zod';
import { UniversityRankLevel } from '@prisma/client';

export const universityListQuerySchema = z.object({
  id: z.string().optional(),
  search: z.string().optional(),
  rank: z.nativeEnum(UniversityRankLevel).optional(),
});

export type UniversityListQueryDto = z.infer<typeof universityListQuerySchema>;
