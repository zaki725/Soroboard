import { ApiProperty } from '@nestjs/swagger';
import { UniversityRankLevel } from '@prisma/client';

export class UniversityResponseDto {
  constructor(partial: Partial<UniversityResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: '大学ID' })
  id: string;

  @ApiProperty({ description: '大学名' })
  name: string;

  @ApiProperty({
    description: '学校ランク',
    enum: UniversityRankLevel,
    required: false,
  })
  rank?: UniversityRankLevel;
}
