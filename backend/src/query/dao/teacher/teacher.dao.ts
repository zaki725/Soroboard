import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';

@Injectable()
export class TeacherDao {
  constructor(private readonly prisma: PrismaService) {}

  async findAllBySchoolId({
    schoolId,
  }: {
    schoolId: string;
  }) {
    const teachers = await this.prisma.teacher.findMany({
      where: {
        schoolId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return teachers;
  }

  async findOne({ id }: { id: string }) {
    return this.prisma.teacher.findUnique({
      where: { id },
    });
  }
}

