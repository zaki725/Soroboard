import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { Prisma } from '@prisma/client';
import type { InterviewerCategory } from '../../types/interviewer.types';
import { InterviewerResponseDto } from '../../dto/interviewer/interviewer.dto';

@Injectable()
export class InterviewerDao {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    userIds,
    search,
    category,
  }: {
    userIds?: string[];
    search?: string;
    category?: InterviewerCategory;
  }): Promise<InterviewerResponseDto[]> {
    const where: Prisma.InterviewerWhereInput = {};

    if (userIds && userIds.length > 0) {
      where.userId = { in: userIds };
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { userId: { contains: search, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    const interviewers = await this.prisma.interviewer.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return interviewers.map((interviewer) => {
      return new InterviewerResponseDto({
        userId: interviewer.userId,
        category: interviewer.category,
        userName: `${interviewer.user.lastName} ${interviewer.user.firstName}`,
        userEmail: interviewer.user.email,
      });
    });
  }

  async findOne({
    userId,
  }: {
    userId: string;
  }): Promise<InterviewerResponseDto | null> {
    const interviewer = await this.prisma.interviewer.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!interviewer) {
      return null;
    }

    return new InterviewerResponseDto({
      userId: interviewer.userId,
      category: interviewer.category,
      userName: `${interviewer.user.lastName} ${interviewer.user.firstName}`,
      userEmail: interviewer.user.email,
    });
  }
}
