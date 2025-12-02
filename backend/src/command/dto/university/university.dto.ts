import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { REQUIRED_FIELD } from '../../../common/constants';
import { UniversityRankLevel } from '@prisma/client';

export class UpdateUniversityRequestDto {
  @ApiProperty({ description: '大学ID' })
  id: string;

  @ApiProperty({ description: '大学名' })
  name: string;

  @ApiProperty({
    description: '学校ランク',
    enum: UniversityRankLevel,
    required: false,
  })
  rank?: UniversityRankLevel;
}

export class CreateUniversityRequestDto {
  @ApiProperty({ description: '大学名' })
  name: string;

  @ApiProperty({
    description: '学校ランク',
    enum: UniversityRankLevel,
    required: false,
  })
  rank?: UniversityRankLevel;
}

export const updateUniversityRequestSchema = z.object({
  id: z.string().min(1, REQUIRED_FIELD('ID')),
  name: z.string().min(1, REQUIRED_FIELD('大学名')),
  rank: z.nativeEnum(UniversityRankLevel).optional(),
});

export const createUniversityRequestSchema = z.object({
  name: z.string().min(1, REQUIRED_FIELD('大学名')),
  rank: z.nativeEnum(UniversityRankLevel).optional(),
});

export class BulkCreateUniversityRequestDto {
  @ApiProperty({ description: '大学名' })
  name: string;

  @ApiProperty({
    description: '学校ランク',
    enum: UniversityRankLevel,
    required: false,
  })
  rank?: UniversityRankLevel;

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

export const bulkCreateUniversityRequestSchema = z.object({
  name: z.string().min(1, REQUIRED_FIELD('大学名')),
  rank: z.nativeEnum(UniversityRankLevel).optional(),
  faculties: z.array(
    z.object({
      name: z.string().min(1, REQUIRED_FIELD('学部名')),
      deviationValue: z.number().min(0).max(100).optional(),
    }),
  ),
});
