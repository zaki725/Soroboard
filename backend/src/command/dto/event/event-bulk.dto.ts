import { z } from 'zod';
import { REQUIRED_FIELD, MIN_LENGTH } from '../../../common/constants';

const eventBulkItemSchema = z
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

export const bulkCreateEventRequestSchema = z.object({
  events: z.array(eventBulkItemSchema).min(1, MIN_LENGTH.EVENTS),
});

export type BulkCreateEventRequestDto = {
  events: {
    startTime: string;
    endTime: string | null;
    notes: string | null;
    eventMasterId: string;
    locationId: string;
    address: string | null;
    interviewerIds?: string[];
  }[];
};
