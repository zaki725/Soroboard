import { ApiProperty } from '@nestjs/swagger';

export class EventMasterResponseDto {
  constructor(partial: Partial<EventMasterResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: 'イベントマスターID' })
  id: string;

  @ApiProperty({ description: 'イベント名' })
  name: string;

  @ApiProperty({ description: '説明', nullable: true })
  description: string | null;

  @ApiProperty({
    description: 'ロケーションタイプ',
    enum: ['オンライン', '対面', 'オンライン_対面'],
  })
  type: string;

  @ApiProperty({ description: '年度ID' })
  recruitYearId: number;
}
