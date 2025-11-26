import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { REQUIRED_FIELD } from '../../../common/constants';

export class CreateFacultyRequestDto {
  @ApiProperty({ description: '学部名' })
  name: string;

  @ApiProperty({ description: '大学ID' })
  universityId: string;

  @ApiProperty({ description: '偏差値', required: false })
  deviationValue?: number;
}

export class UpdateFacultyRequestDto {
  @ApiProperty({ description: '学部ID' })
  id: string;

  @ApiProperty({ description: '学部名' })
  name: string;

  @ApiProperty({ description: '偏差値', required: false })
  deviationValue?: number;
}

export const createFacultyRequestSchema = z.object({
  name: z.string().min(1, REQUIRED_FIELD('学部名')),
  universityId: z.string().min(1, REQUIRED_FIELD('大学ID')),
  deviationValue: z.number().min(0).max(100).optional(),
});

export const updateFacultyRequestSchema = z.object({
  id: z.string().min(1, REQUIRED_FIELD('ID')),
  name: z.string().min(1, REQUIRED_FIELD('学部名')),
  deviationValue: z.number().min(0).max(100).optional(),
});

export class BulkCreateFacultyRequestDto {
  @ApiProperty({
    description: '学部と偏差値の配列',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: { type: 'string', description: '学部名' },
        deviationValue: { type: 'number', description: '偏差値' },
      },
    },
  })
  faculties: Array<{
    name: string;
    deviationValue?: number;
  }>;
}

export const bulkCreateFacultyRequestSchema = z.object({
  faculties: z.array(
    z.object({
      name: z.string().min(1, REQUIRED_FIELD('学部名')),
      deviationValue: z.number().min(0).max(100).optional(),
    }),
  ),
});
