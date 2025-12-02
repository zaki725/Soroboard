import { z } from 'zod';

export const departmentListQuerySchema = z.object({
  id: z.string().optional(),
  search: z.string().optional(),
});

export type DepartmentListQueryDto = z.infer<typeof departmentListQuerySchema>;
