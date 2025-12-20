import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { Prisma } from '@prisma/client';
import type { UserRole, Gender } from '../../types/user.types';
import { UserResponseDto } from '../../dto/user/user-response.dto';

type FindManyParams = {
  page?: number;
  pageSize?: number;
  ids?: string[];
  search?: string;
  role?: UserRole;
  gender?: Gender;
  departmentId?: string;
};

@Injectable()
export class UserDao {
  constructor(private readonly prisma: PrismaService) {}

  async findOne({ id }: { id: string }): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return new UserResponseDto({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      departmentId: user.departmentId,
      createdAt: user.createdAt,
      createdBy: user.createdBy,
      updatedAt: user.updatedAt,
      updatedBy: user.updatedBy,
      departmentName: user.department?.name ?? null,
    });
  }

  async findMany({
    page = 1,
    pageSize = 10,
    ids,
    search,
    role,
    gender,
    departmentId,
  }: FindManyParams): Promise<{
    users: UserResponseDto[];
    total: number;
  }> {
    const skip = (page - 1) * pageSize;
    const where: Prisma.UserWhereInput = {};

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (gender) {
      where.gender = gender;
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    const [usersData, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const users = usersData.map(
      (user) =>
        new UserResponseDto({
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          departmentId: user.departmentId,
          createdAt: user.createdAt,
          createdBy: user.createdBy,
          updatedAt: user.updatedAt,
          updatedBy: user.updatedBy,
          departmentName: user.department?.name ?? null,
        }),
    );

    return { users, total };
  }

  async findManyForExport({
    ids,
    search,
    role,
    gender,
    departmentId,
  }: {
    ids?: string[];
    search?: string;
    role?: UserRole;
    gender?: Gender;
    departmentId?: string;
  }): Promise<UserResponseDto[]> {
    const where: Prisma.UserWhereInput = {};

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (gender) {
      where.gender = gender;
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    const usersData = await this.prisma.user.findMany({
      where,
      include: {
        interviewer: {
          select: {
            category: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return usersData.map(
      (user) =>
        new UserResponseDto({
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          departmentId: user.departmentId,
          createdAt: user.createdAt,
          createdBy: user.createdBy,
          updatedAt: user.updatedAt,
          updatedBy: user.updatedBy,
          departmentName: user.department?.name ?? null,
        }),
    );
  }
}
