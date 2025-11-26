import { ApiProperty } from '@nestjs/swagger';
import type { EducationType } from '../../../command/domain/educational-background/educational-background.entity';

export class EducationalBackgroundResponseDto {
  constructor(partial: Partial<EducationalBackgroundResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: '学歴ID' })
  id: string;

  @ApiProperty({ description: '面接官ID（ユーザーID）' })
  interviewerId: string;

  @ApiProperty({
    description: '教育タイプ',
    enum: ['大学院', '大学', '短期大学', '専門学校', '高等学校', 'その他'],
  })
  educationType: EducationType;

  @ApiProperty({ description: '大学ID', required: false })
  universityId?: string;

  @ApiProperty({ description: '大学名', required: false })
  universityName?: string;

  @ApiProperty({ description: '学部ID', required: false })
  facultyId?: string;

  @ApiProperty({ description: '学部名', required: false })
  facultyName?: string;

  @ApiProperty({ description: '卒業年', required: false })
  graduationYear?: number;

  @ApiProperty({ description: '卒業月', required: false })
  graduationMonth?: number;
}

export class EducationalBackgroundListResponseDto {
  constructor({
    educationalBackgrounds,
  }: {
    educationalBackgrounds: EducationalBackgroundResponseDto[];
  }) {
    this.educationalBackgrounds = educationalBackgrounds;
  }

  @ApiProperty({
    description: '学歴一覧',
    type: [EducationalBackgroundResponseDto],
  })
  educationalBackgrounds: EducationalBackgroundResponseDto[];
}
