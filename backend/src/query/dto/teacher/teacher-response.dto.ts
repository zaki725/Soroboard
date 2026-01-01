import { ApiProperty } from '@nestjs/swagger';
import type { TeacherRole } from '../../../common/enums';
import { TEACHER_ROLES } from '../../../common/enums';
import { FIELD_NAME } from '../../../common/constants';

export class TeacherResponseDto {
  constructor(partial: Partial<TeacherResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: FIELD_NAME.TEACHER_ID })
  id: string;

  @ApiProperty({ description: 'メールアドレス' })
  email: string;

  @ApiProperty({ description: '塾内での役割', enum: TEACHER_ROLES })
  roleInSchool: TeacherRole;

  @ApiProperty({ description: '名' })
  firstName: string;

  @ApiProperty({ description: '姓' })
  lastName: string;

  @ApiProperty({ description: '時給', nullable: true, required: false })
  hourlyRate: number | null;

  @ApiProperty({ description: '在籍状況' })
  isActive: boolean;

  @ApiProperty({ description: 'メモ', nullable: true, required: false })
  memo: string | null;

  @ApiProperty({ description: FIELD_NAME.SCHOOL_ID })
  schoolId: string;
}

