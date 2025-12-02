import { z } from 'zod';
import {
  INTERVIEWER_CATEGORIES,
  type InterviewerCategory,
} from '../../../common/enums';

export const interviewerListQuerySchema = z.object({
  userId: z.string().optional(),
  search: z.string().optional(),
  category: z
    .enum(
      INTERVIEWER_CATEGORIES as [InterviewerCategory, ...InterviewerCategory[]],
    )
    .optional(),
});

export type InterviewerListQueryDto = z.infer<
  typeof interviewerListQuerySchema
>;
