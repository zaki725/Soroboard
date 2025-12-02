import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { REQUIRED_FIELD } from '../../../common/constants';
import {
  INTERVIEWER_CATEGORIES,
  type InterviewerCategory,
} from '../../../query/types/interviewer.types';

export class CreateInterviewerRequestDto {
  @ApiProperty({ description: 'ユーザーID' })
  userId: string;

  @ApiProperty({ description: 'カテゴリ', enum: INTERVIEWER_CATEGORIES })
  category: InterviewerCategory;

  @ApiProperty({ description: '出身大学ID', required: false })
  universityId?: string;

  @ApiProperty({ description: '出身学部ID', required: false })
  facultyId?: string;
}

export const createInterviewerRequestSchema = z.object({
  userId: z.string().min(1, REQUIRED_FIELD('ユーザーID')),
  category: z.enum(
    INTERVIEWER_CATEGORIES as [InterviewerCategory, ...InterviewerCategory[]],
    {
      errorMap: () => ({
        message: 'カテゴリはフロントまたは現場社員である必要があります',
      }),
    },
  ),
  universityId: z.string().optional(),
  facultyId: z.string().optional(),
});

export class UpdateInterviewerRequestDto {
  @ApiProperty({ description: 'ユーザーID（主キー）' })
  userId: string;

  @ApiProperty({ description: 'カテゴリ', enum: INTERVIEWER_CATEGORIES })
  category: InterviewerCategory;

  @ApiProperty({ description: '出身大学ID', required: false })
  universityId?: string;

  @ApiProperty({ description: '出身学部ID', required: false })
  facultyId?: string;
}

export const updateInterviewerRequestSchema = z.object({
  userId: z.string().min(1, REQUIRED_FIELD('ユーザーID')),
  category: z.enum(
    INTERVIEWER_CATEGORIES as [InterviewerCategory, ...InterviewerCategory[]],
    {
      errorMap: () => ({
        message: 'カテゴリはフロントまたは現場社員である必要があります',
      }),
    },
  ),
  universityId: z.string().optional(),
  facultyId: z.string().optional(),
});

export class BulkCreateInterviewerRequestDto {
  @ApiProperty({
    description: '面接官一覧',
    type: [CreateInterviewerRequestDto],
  })
  interviewers: CreateInterviewerRequestDto[];
}

const bulkCreateInterviewerItemSchema = z.object({
  userId: z.string().min(1, REQUIRED_FIELD('ユーザーID')),
  category: z.enum(
    INTERVIEWER_CATEGORIES as [InterviewerCategory, ...InterviewerCategory[]],
    {
      errorMap: () => ({
        message: 'カテゴリはフロントまたは現場社員である必要があります',
      }),
    },
  ),
  universityId: z.string().optional(),
  facultyId: z.string().optional(),
});

export const bulkCreateInterviewerRequestSchema = z.object({
  interviewers: z
    .array(bulkCreateInterviewerItemSchema)
    .min(1, '面接官が1件以上必要です'),
});

export class BulkUpdateInterviewerRequestDto {
  @ApiProperty({
    description: '面接官一覧',
    type: [UpdateInterviewerRequestDto],
  })
  interviewers: UpdateInterviewerRequestDto[];
}

const bulkUpdateInterviewerItemSchema = z.object({
  userId: z.string().min(1, REQUIRED_FIELD('ユーザーID')),
  category: z.enum(
    INTERVIEWER_CATEGORIES as [InterviewerCategory, ...InterviewerCategory[]],
    {
      errorMap: () => ({
        message: 'カテゴリはフロントまたは現場社員である必要があります',
      }),
    },
  ),
  universityId: z.string().optional(),
  facultyId: z.string().optional(),
});

export const bulkUpdateInterviewerRequestSchema = z.object({
  interviewers: z
    .array(bulkUpdateInterviewerItemSchema)
    .min(1, '面接官が1件以上必要です'),
});
