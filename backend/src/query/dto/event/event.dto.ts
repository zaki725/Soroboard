import { ApiProperty } from '@nestjs/swagger';

export class EventResponseDto {
  constructor(partial: Partial<EventResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: 'イベントID' })
  id: string;

  @ApiProperty({ description: '開始時刻' })
  startTime: Date;

  @ApiProperty({ description: '終了時刻', nullable: true })
  endTime: Date | null;

  @ApiProperty({ description: '備考', nullable: true })
  notes: string | null;

  @ApiProperty({ description: 'イベントマスターID' })
  eventMasterId: string;

  @ApiProperty({ description: 'イベントマスター名' })
  eventMasterName: string;

  @ApiProperty({ description: 'ロケーションID' })
  locationId: string;

  @ApiProperty({ description: 'ロケーション名' })
  locationName: string;

  @ApiProperty({ description: '開催場所', nullable: true })
  address: string | null;

  @ApiProperty({ description: '面接官ID配列', type: [String], required: false })
  interviewerIds?: string[];
}
