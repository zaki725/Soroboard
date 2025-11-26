import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { Prisma } from '@prisma/client';
import { DepartmentResponseDto } from '../../dto/department/department.dto';

@Injectable()
export class DepartmentDao {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    ids,
    search,
  }: {
    ids?: string[];
    search?: string;
  }): Promise<DepartmentResponseDto[]> {
    const where: Prisma.DepartmentWhereInput = {};

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const departments = await this.prisma.department.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return departments.map(
      (department) =>
        new DepartmentResponseDto({
          id: department.id,
          name: department.name,
        }),
    );
  }

  async findOne({ id }: { id: string }): Promise<DepartmentResponseDto | null> {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      return null;
    }

    return new DepartmentResponseDto({
      id: department.id,
      name: department.name,
    });
  }
}
