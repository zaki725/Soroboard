import { z } from 'zod';
import { schoolBasedListQuerySchema } from '../../../common/dto/school-based-list-query.dto';

export const teacherListQuerySchema = schoolBasedListQuerySchema;
export type TeacherListQueryDto = z.infer<typeof teacherListQuerySchema>;

