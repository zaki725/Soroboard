import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { REQUIRED_FIELD } from '../../../common/constants';
import { LOCATION_TYPES, type LocationType } from '../../../common/enums';

export class UpdateEventMasterRequestDto {
  @ApiProperty({ description: 'イベントマスターID' })
  id: string;

  @ApiProperty({ description: 'イベント名' })
  name: string;

  @ApiProperty({ description: '説明', nullable: true })
  description: string | null;

  @ApiProperty({ description: 'ロケーションタイプ', enum: LOCATION_TYPES })
  type: LocationType;
}

export class CreateEventMasterRequestDto {
  @ApiProperty({ description: 'イベント名' })
  name: string;

  @ApiProperty({ description: '説明', nullable: true })
  description: string | null;

  @ApiProperty({ description: 'ロケーションタイプ', enum: LOCATION_TYPES })
  type: LocationType;

  @ApiProperty({ description: '年度ID' })
  recruitYearId: number;
}

export const updateEventMasterRequestSchema = z.object({
  id: z.string().min(1, REQUIRED_FIELD('ID')),
  name: z.string().min(1, REQUIRED_FIELD('イベント名')),
  description: z.string().nullable(),
  type: z.enum(LOCATION_TYPES as [LocationType, ...LocationType[]], {
    errorMap: () => ({ message: REQUIRED_FIELD('ロケーションタイプ') }),
  }),
});

export const createEventMasterRequestSchema = z.object({
  name: z.string().min(1, REQUIRED_FIELD('イベント名')),
  description: z.string().nullable(),
  type: z.enum(LOCATION_TYPES as [LocationType, ...LocationType[]], {
    errorMap: () => ({ message: REQUIRED_FIELD('ロケーションタイプ') }),
  }),
  recruitYearId: z.number().int().positive(REQUIRED_FIELD('年度ID')),
});

export class DeleteEventMasterRequestDto {
  @ApiProperty({ description: 'イベントマスターID' })
  id: string;
}

export const deleteEventMasterRequestSchema = z.object({
  id: z.string().min(1, REQUIRED_FIELD('ID')),
});

export class BulkCreateEventMasterRequestDto {
  @ApiProperty({
    description: 'イベントマスター一覧',
    type: [CreateEventMasterRequestDto],
  })
  eventMasters: CreateEventMasterRequestDto[];
}

export const bulkCreateEventMasterRequestSchema = z.object({
  eventMasters: z
    .array(createEventMasterRequestSchema)
    .min(1, 'イベントマスターは1件以上必要です'),
});
