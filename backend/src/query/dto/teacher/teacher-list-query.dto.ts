import { z } from 'zod';
import { REQUIRED_FIELD, FIELD_NAME } from '../../../common/constants';

export const teacherListQuerySchema = z.object({
  schoolId: z.string().min(1, REQUIRED_FIELD(FIELD_NAME.SCHOOL_ID)),
});

export type TeacherListQueryDto = z.infer<typeof teacherListQuerySchema>;

