import { ApiProperty } from '@nestjs/swagger';
import { StudentStatus } from '@prisma/client';
import { FIELD_NAME } from '../../../common/constants';

export class StudentResponseDto {
  constructor(partial: Partial<StudentResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: FIELD_NAME.STUDENT_ID })
  id: string;

  @ApiProperty({ description: '教室内の管理番号', nullable: true, required: false })
  studentNo: string | null;

  @ApiProperty({ description: '名' })
  firstName: string;

  @ApiProperty({ description: '姓' })
  lastName: string;

  @ApiProperty({ description: '名（カナ）' })
  firstNameKana: string;

  @ApiProperty({ description: '姓（カナ）' })
  lastNameKana: string;

  @ApiProperty({ description: '生年月日', nullable: true, required: false })
  birthDate: Date | null;

  @ApiProperty({ description: '在籍状況', enum: StudentStatus })
  status: StudentStatus;

  @ApiProperty({ description: '入会日' })
  joinedAt: Date;

  @ApiProperty({ description: '退会日', nullable: true, required: false })
  leftAt: Date | null;

  @ApiProperty({ description: 'メモ', nullable: true, required: false })
  note: string | null;

  @ApiProperty({ description: FIELD_NAME.SCHOOL_ID })
  schoolId: string;
}

