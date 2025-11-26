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

export class FacultyResponseDto {
  constructor(partial: Partial<FacultyResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: '学部ID' })
  id: string;

  @ApiProperty({ description: '学部名' })
  name: string;

  @ApiProperty({ description: '大学ID' })
  universityId: string;

  @ApiProperty({ description: '大学名' })
  universityName: string;

  @ApiProperty({
    description: '偏差値',
    type: DeviationValueResponseDto,
    required: false,
  })
  deviationValue: DeviationValueResponseDto | null;
}
