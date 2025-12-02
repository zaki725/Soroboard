import { z } from 'zod';
import {
  USER_ROLES,
  GENDERS,
  type UserRole,
  type Gender,
} from '../../../common/enums';

export const userExportQuerySchema = z.object({
  id: z.string().optional(),
  search: z.string().optional(),
  role: z.enum(USER_ROLES as [UserRole, ...UserRole[]]).optional(),
  gender: z.enum(GENDERS as [Gender, ...Gender[]]).optional(),
  departmentId: z.string().optional(),
});

export type UserExportQueryDto = z.infer<typeof userExportQuerySchema>;
