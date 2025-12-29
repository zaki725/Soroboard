import { Injectable } from '@nestjs/common';
import { TeacherDao } from '../../dao/teacher/teacher.dao';
import { TeacherResponseDto } from '../../dto/teacher/teacher-response.dto';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { RESOURCE_NAME } from '../../../common/constants';
import { Teacher } from '@prisma/client';

@Injectable()
export class TeacherService {
  constructor(private readonly teacherDao: TeacherDao) {}

  async findAllBySchoolId({
    schoolId,
  }: {
    schoolId: string;
  }): Promise<TeacherResponseDto[]> {
    const teachers = await this.teacherDao.findAllBySchoolId({
      schoolId,
    });

    return teachers.map((teacher) => this.toDto(teacher));
  }

  async findOne({ id }: { id: string }): Promise<TeacherResponseDto> {
    const teacher = await this.teacherDao.findOne({ id });
    if (!teacher) {
      throw new NotFoundError(RESOURCE_NAME.TEACHER, id);
    }

    return this.toDto(teacher);
  }

  private toDto(teacher: Teacher): TeacherResponseDto {
    return new TeacherResponseDto({
      id: teacher.id,
      email: teacher.email,
      roleInSchool: teacher.roleInSchool,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      hourlyRate: teacher.hourlyRate,
      isActive: teacher.isActive,
      memo: teacher.memo,
      schoolId: teacher.schoolId,
    });
  }
}

