import { z } from 'zod';
import { schoolBasedListQuerySchema } from '../../../common/dto/school-based-list-query.dto';

export const studentListQuerySchema = schoolBasedListQuerySchema;
export type StudentListQueryDto = z.infer<typeof studentListQuerySchema>;

