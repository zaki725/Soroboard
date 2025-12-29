import { Injectable } from '@nestjs/common';
import { StudentDao } from '../../dao/student/student.dao';
import { StudentResponseDto } from '../../dto/student/student-response.dto';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { RESOURCE_NAME } from '../../../common/constants';
import { Student } from '@prisma/client';

@Injectable()
export class StudentService {
  constructor(private readonly studentDao: StudentDao) {}

  async findAllBySchoolId({ schoolId }: { schoolId: string }): Promise<StudentResponseDto[]> {
    const students = await this.studentDao.findAllBySchoolId({ schoolId });

    return students.map((student) => this.toDto(student));
  }

  async findOne({ id }: { id: string }): Promise<StudentResponseDto> {
    const student = await this.studentDao.findOne({ id });
    if (!student) {
      throw new NotFoundError(RESOURCE_NAME.STUDENT, id);
    }

    return this.toDto(student);
  }

  private toDto(student: Student): StudentResponseDto {
    return new StudentResponseDto({
      id: student.id,
      studentNo: student.studentNo,
      firstName: student.firstName,
      lastName: student.lastName,
      firstNameKana: student.firstNameKana,
      lastNameKana: student.lastNameKana,
      birthDate: student.birthDate,
      status: student.status,
      joinedAt: student.joinedAt,
      leftAt: student.leftAt,
      note: student.note,
    });
  }
}

