import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { REQUIRED_FIELD } from '../../../common/constants';

export class UpdateEventRequestDto {
  @ApiProperty({ description: 'イベントID' })
  id: string;

  @ApiProperty({ description: '開始時刻' })
  startTime: string;

  @ApiProperty({ description: '終了時刻', nullable: true })
  endTime: string | null;

  @ApiProperty({ description: '備考', nullable: true })
  notes: string | null;

  @ApiProperty({ description: 'ロケーションID' })
  locationId: string;

  @ApiProperty({ description: '開催場所', nullable: true })
  address: string | null;

  @ApiProperty({ description: '面接官ID配列', type: [String], required: false })
  interviewerIds?: string[];
}

export class CreateEventRequestDto {
  @ApiProperty({ description: '開始時刻' })
  startTime: string;

  @ApiProperty({ description: '終了時刻', nullable: true })
  endTime: string | null;

  @ApiProperty({ description: '備考', nullable: true })
  notes: string | null;

  @ApiProperty({ description: 'イベントマスターID' })
  eventMasterId: string;

  @ApiProperty({ description: 'ロケーションID' })
  locationId: string;

  @ApiProperty({ description: '開催場所', nullable: true })
  address: string | null;

  @ApiProperty({ description: '面接官ID配列', type: [String], required: false })
  interviewerIds?: string[];
}

export const updateEventRequestSchema = z
  .object({
    id: z.string().min(1, REQUIRED_FIELD('ID')),
    startTime: z.string().min(1, REQUIRED_FIELD('開始時刻')),
    endTime: z.string().nullable(),
    notes: z.string().nullable(),
    locationId: z.string().min(1, REQUIRED_FIELD('ロケーションID')),
    address: z.string().nullable(),
    interviewerIds: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);
        return start < end;
      }
      return true;
    },
    {
      message: '開始時刻は終了時刻より前である必要があります',
    },
  );

export const createEventRequestSchema = z
  .object({
    startTime: z.string().min(1, REQUIRED_FIELD('開始時刻')),
    endTime: z.string().nullable(),
    notes: z.string().nullable(),
    eventMasterId: z.string().min(1, REQUIRED_FIELD('イベントマスターID')),
    locationId: z.string().min(1, REQUIRED_FIELD('ロケーションID')),
    address: z.string().nullable(),
    interviewerIds: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);
        return start < end;
      }
      return true;
    },
    {
      message: '開始時刻は終了時刻より前である必要があります',
    },
  );

export class DeleteEventRequestDto {
  @ApiProperty({ description: 'イベントID' })
  id: string;
}

export const deleteEventRequestSchema = z.object({
  id: z.string().min(1, REQUIRED_FIELD('ID')),
});
