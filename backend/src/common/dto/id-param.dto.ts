import { z } from 'zod';
import { REQUIRED_FIELD, FIELD_NAME } from '../constants';

export const createIdParamSchema = (fieldName: string) =>
  z.string().min(1, REQUIRED_FIELD(fieldName));

export const studentIdParamSchema = createIdParamSchema(FIELD_NAME.STUDENT_ID);
export const teacherIdParamSchema = createIdParamSchema(FIELD_NAME.TEACHER_ID);
