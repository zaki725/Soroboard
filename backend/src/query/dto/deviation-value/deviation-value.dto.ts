import { ApiProperty } from '@nestjs/swagger';

export class DeviationValueResponseDto {
  constructor(partial: Partial<DeviationValueResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: '偏差値ID' })
  id: string;

  @ApiProperty({ description: '学部ID' })
  facultyId: string;

  @ApiProperty({ description: '偏差値' })
  value: number;
}

