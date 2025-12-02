import { z } from 'zod';
import { REQUIRED_FIELD, INVALID } from '../../../common/constants';
import {
  USER_ROLES,
  GENDERS,
  type UserRole,
  type Gender,
} from '../../../common/enums';

export type CreateUserRequestDto = {
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  gender: Gender | null;
  departmentId: string;
};

export type UpdateUserRequestDto = {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  gender: Gender | null;
  departmentId: string;
};

const userRequestSchemaObject = {
  email: z.string().email(INVALID.EMAIL_FORMAT),
  role: z.enum(USER_ROLES as [UserRole, ...UserRole[]], {
    errorMap: () => ({ message: INVALID.ROLE }),
  }),
  firstName: z.string().min(1, REQUIRED_FIELD('名')),
  lastName: z.string().min(1, REQUIRED_FIELD('姓')),
  gender: z.enum(GENDERS as [Gender, ...Gender[]]).nullable(),
  departmentId: z.string().min(1, REQUIRED_FIELD('部署')),
};

export const createUserRequestSchema = z.object(userRequestSchemaObject);

export const updateUserRequestBodySchema = z.object(userRequestSchemaObject);

export const updateUserRequestSchema = z.object({
  id: z.string().min(1, REQUIRED_FIELD('ユーザーID')),
  ...userRequestSchemaObject,
});
