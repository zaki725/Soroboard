import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { RecruitYearResponseDto } from '../../dto/recruit-year/recruit-year.dto';

@Injectable()
export class RecruitYearDao {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<RecruitYearResponseDto[]> {
    const recruitYears = await this.prisma.recruitYear.findMany({
      orderBy: {
        recruitYear: 'desc',
      },
    });

    return recruitYears.map(
      (recruitYear) =>
        new RecruitYearResponseDto({
          recruitYear: recruitYear.recruitYear,
          displayName: recruitYear.displayName,
          themeColor: recruitYear.themeColor,
        }),
    );
  }

  async findOne({
    recruitYear,
  }: {
    recruitYear: number;
  }): Promise<RecruitYearResponseDto | null> {
    const recruitYearData = await this.prisma.recruitYear.findUnique({
      where: { recruitYear },
    });

    if (!recruitYearData) {
      return null;
    }

    return new RecruitYearResponseDto({
      recruitYear: recruitYearData.recruitYear,
      displayName: recruitYearData.displayName,
      themeColor: recruitYearData.themeColor,
    });
  }
}
