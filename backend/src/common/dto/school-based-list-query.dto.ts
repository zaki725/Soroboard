import { z } from 'zod';
import { REQUIRED_FIELD, FIELD_NAME } from '../constants';

export const schoolBasedListQuerySchema = z.object({
  schoolId: z.string().min(1, REQUIRED_FIELD(FIELD_NAME.SCHOOL_ID)),
});
