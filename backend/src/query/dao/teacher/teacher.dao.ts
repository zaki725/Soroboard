import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { Teacher } from '@prisma/client';

@Injectable()
export class TeacherDao {
  constructor(private readonly prisma: PrismaService) {}

  async findAllBySchoolId({
    schoolId,
  }: {
    schoolId: string;
  }): Promise<Teacher[]> {
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

  async findOne({ id }: { id: string }): Promise<Teacher | null> {
    return this.prisma.teacher.findUnique({
      where: { id },
    });
  }
}

