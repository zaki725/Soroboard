import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { REQUIRED_FIELD } from '../../../common/constants';

export class UpdateEventLocationRequestDto {
  @ApiProperty({ description: 'ロケーションID' })
  id: string;

  @ApiProperty({ description: 'ロケーション名' })
  name: string;
}

export class CreateEventLocationRequestDto {
  @ApiProperty({ description: 'ロケーション名' })
  name: string;
}

export const updateEventLocationRequestSchema = z.object({
  id: z.string().min(1, REQUIRED_FIELD('ID')),
  name: z.string().min(1, REQUIRED_FIELD('ロケーション名')),
});

export const createEventLocationRequestSchema = z.object({
  name: z.string().min(1, REQUIRED_FIELD('ロケーション名')),
});

export class DeleteEventLocationRequestDto {
  @ApiProperty({ description: 'ロケーションID' })
  id: string;
}

export const deleteEventLocationRequestSchema = z.object({
  id: z.string().min(1, REQUIRED_FIELD('ID')),
});

export class BulkCreateEventLocationRequestDto {
  @ApiProperty({
    description: 'ロケーション一覧',
    type: [CreateEventLocationRequestDto],
  })
  eventLocations: CreateEventLocationRequestDto[];
}

export const bulkCreateEventLocationRequestSchema = z.object({
  eventLocations: z
    .array(createEventLocationRequestSchema)
    .min(1, 'ロケーションは1件以上必要です'),
});
