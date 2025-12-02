import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { REQUIRED_FIELD } from '../../../common/constants';

export class CreateDeviationValueRequestDto {
  @ApiProperty({ description: '学部ID' })
  facultyId: string;

  @ApiProperty({ description: '偏差値' })
  value: number;
}

export class UpdateDeviationValueRequestDto {
  @ApiProperty({ description: '偏差値ID' })
  id: string;

  @ApiProperty({ description: '偏差値' })
  value: number;
}

export const createDeviationValueRequestSchema = z.object({
  facultyId: z.string().min(1, REQUIRED_FIELD('学部ID')),
  value: z.number().min(0).max(100, '偏差値は0-100の範囲で入力してください'),
});

export const updateDeviationValueRequestSchema = z.object({
  id: z.string().min(1, REQUIRED_FIELD('ID')),
  value: z.number().min(0).max(100, '偏差値は0-100の範囲で入力してください'),
});
