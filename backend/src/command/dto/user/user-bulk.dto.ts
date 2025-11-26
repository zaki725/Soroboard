import { z } from 'zod';
import { REQUIRED_FIELD, INVALID, MIN_LENGTH } from '../../../common/constants';
import {
  USER_ROLES,
  GENDERS,
  type UserRole,
  type Gender,
} from '../../../common/enums';

const userBulkItemSchema = z.object({
  email: z.string().email(INVALID.EMAIL_FORMAT),
  firstName: z.string().min(1, REQUIRED_FIELD('名')),
  lastName: z.string().min(1, REQUIRED_FIELD('姓')),
  role: z.enum(USER_ROLES as [UserRole, ...UserRole[]], {
    errorMap: () => ({ message: INVALID.ROLE }),
  }),
  gender: z.enum(GENDERS as [Gender, ...Gender[]]).nullable(),
  departmentId: z.string().min(1, REQUIRED_FIELD('部署')),
});

export const bulkCreateUserRequestSchema = z.object({
  users: z.array(userBulkItemSchema).min(1, MIN_LENGTH.USERS),
});

export type BulkCreateUserRequestDto = {
  users: {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    gender: Gender | null;
    departmentId: string;
  }[];
};
