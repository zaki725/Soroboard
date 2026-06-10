import { Injectable } from '@nestjs/common';
import type { Student } from '@prisma/client';
import { StudentSearchDao } from '../../dao/student/student-search.dao';
import { StudentResponseDto } from '../../dto/student/student-response.dto';
import type { StudentSearchParams } from '../../types/student.types';

@Injectable()
export class StudentSearchService {
  constructor(private readonly studentSearchDao: StudentSearchDao) {}

  async search({
    schoolId,
    search,
    status,
  }: StudentSearchParams): Promise<StudentResponseDto[]> {
    const students = await this.studentSearchDao.search({
      schoolId,
      search,
      status,
    });

    return students.map((student) => this.toDto(student));
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
      schoolId: student.schoolId,
    });
  }
}
