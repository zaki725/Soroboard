import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import type { Student } from '@prisma/client';
import type { StudentSearchParams } from '../../types/student.types';
import { buildStudentSearchWhere } from './student-search-query.builder';

@Injectable()
export class StudentSearchDao {
  constructor(private readonly prisma: PrismaService) {}

  async search({
    schoolId,
    search,
    status,
  }: StudentSearchParams): Promise<Student[]> {
    const where = buildStudentSearchWhere({
      schoolId,
      search,
      status,
    });
    const students = await this.prisma.student.findMany({
      where,
      orderBy: [{ studentNo: 'asc' }, { createdAt: 'desc' }],
    });

    return students;
  }
}
