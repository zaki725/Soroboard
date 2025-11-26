import { ApiProperty } from '@nestjs/swagger';

export class EventLocationResponseDto {
  constructor(partial: Partial<EventLocationResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: 'ロケーションID' })
  id: string;

  @ApiProperty({ description: 'ロケーション名' })
  name: string;
}
