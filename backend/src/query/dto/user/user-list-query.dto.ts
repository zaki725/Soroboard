import { z } from 'zod';
import { INVALID } from '../../../common/constants';
import {
  USER_ROLES,
  GENDERS,
  type UserRole,
  type Gender,
} from '../../../common/enums';

export const userListQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .refine(
      (val) => val === undefined || (Number.isInteger(val) && val > 0),
      INVALID.PAGE,
    ),
  pageSize: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .refine(
      (val) => val === undefined || (Number.isInteger(val) && val > 0),
      INVALID.PAGE_SIZE,
    ),
  id: z.string().optional(),
  search: z.string().optional(),
  role: z.enum(USER_ROLES as [UserRole, ...UserRole[]]).optional(),
  gender: z.enum(GENDERS as [Gender, ...Gender[]]).optional(),
  departmentId: z.string().optional(),
});

export type UserListQueryDto = z.infer<typeof userListQuerySchema>;
