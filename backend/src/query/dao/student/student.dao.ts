import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { Student } from '@prisma/client';

@Injectable()
export class StudentDao {
  constructor(private readonly prisma: PrismaService) {}

  async findAllBySchoolId({ schoolId }: { schoolId: string }): Promise<Student[]> {
    const students = await this.prisma.student.findMany({
      where: { schoolId },
      orderBy: [
        { studentNo: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return students;
  }

  async findOne({ id }: { id: string }): Promise<Student | null> {
    return this.prisma.student.findUnique({
      where: { id },
    });
  }
}

