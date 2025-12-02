import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { RecruitYear } from '@prisma/client';
import { IRecruitYearRepository } from '../../domain/recruit-year/recruit-year.repository.interface';
import { EVENT_TYPES } from '../../constants/event-types';

@Injectable()
export class RecruitYearRepository implements IRecruitYearRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    recruitYear,
    displayName,
    themeColor,
    createdBy,
    updatedBy,
  }: {
    recruitYear: number;
    displayName: string;
    themeColor: string;
    createdBy: string;
    updatedBy: string;
  }): Promise<RecruitYear> {
    return await this.prisma.$transaction(async (tx) => {
      const recruitYearData = await tx.recruitYear.create({
        data: {
          recruitYear,
          displayName,
          themeColor,
          createdBy,
          updatedBy,
        },
      });

      await tx.outbox.create({
        data: {
          eventType: EVENT_TYPES.RECRUIT_YEAR_CREATED,
          payload: {
            recruitYear: recruitYearData.recruitYear,
            displayName: recruitYearData.displayName,
            themeColor: recruitYearData.themeColor,
            createdAt: recruitYearData.createdAt.toISOString(),
            createdBy: recruitYearData.createdBy,
          },
          status: 'pending',
        },
      });

      return recruitYearData;
    });
  }

  async update({
    recruitYear,
    displayName,
    themeColor,
    updatedBy,
  }: {
    recruitYear: number;
    displayName: string;
    themeColor: string;
    updatedBy: string;
  }): Promise<RecruitYear> {
    return await this.prisma.$transaction(async (tx) => {
      const recruitYearData = await tx.recruitYear.update({
        where: { recruitYear },
        data: {
          displayName,
          themeColor,
          updatedBy,
        },
      });

      await tx.outbox.create({
        data: {
          eventType: EVENT_TYPES.RECRUIT_YEAR_UPDATED,
          payload: {
            recruitYear: recruitYearData.recruitYear,
            displayName: recruitYearData.displayName,
            themeColor: recruitYearData.themeColor,
            updatedAt: recruitYearData.updatedAt.toISOString(),
            updatedBy: recruitYearData.updatedBy,
          },
          status: 'pending',
        },
      });

      return recruitYearData;
    });
  }
}
