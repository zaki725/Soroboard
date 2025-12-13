import { z } from 'zod';
import type { AuthUserRole } from '@prisma/client';
import { REQUIRED_FIELD, INVALID, FIELD_NAME } from '../../../common/constants';

export type LoginRequestDto = {
  email: string;
  password: string;
};

export type LoginResponseDto = {
  id: string;
  email: string;
  role: AuthUserRole;
  firstName: string;
  lastName: string;
};

export const loginRequestSchema = z.object({
  email: z.string().email(INVALID.EMAIL_FORMAT),
  password: z.string().min(1, REQUIRED_FIELD(FIELD_NAME.PASSWORD)),
});

