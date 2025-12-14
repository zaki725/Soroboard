import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { ITeacherRepository } from '../../domain/teacher/teacher.repository.interface';
import { TeacherEntity } from '../../domain/teacher/teacher.entity';
import { TeacherMapper } from '../../domain/teacher/teacher.mapper';

@Injectable()
export class TeacherRepository implements ITeacherRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<TeacherEntity | null> {
    const teacherData = await this.prisma.teacher.findUnique({
      where: { email },
    });

    if (!teacherData) {
      return null;
    }

    return TeacherMapper.toDomain(teacherData);
  }
}

