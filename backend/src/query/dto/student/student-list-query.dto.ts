import { z } from 'zod';
import { STUDENT_STATUSES } from '../../../common/enums';

export const studentListQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(STUDENT_STATUSES).optional(),
});

export type StudentListQueryDto = z.infer<typeof studentListQuerySchema>;
