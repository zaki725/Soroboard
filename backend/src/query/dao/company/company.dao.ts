import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { Prisma } from '@prisma/client';
import { CompanyResponseDto } from '../../dto/company/company.dto';

@Injectable()
export class CompanyDao {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    recruitYearId,
    ids,
    search,
  }: {
    recruitYearId: number;
    ids?: string[];
    search?: string;
  }): Promise<CompanyResponseDto[]> {
    const where: Prisma.CompanyWhereInput = {
      recruitYearId,
    };

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
        { websiteUrl: { contains: search, mode: 'insensitive' } },
      ];
    }

    const companies = await this.prisma.company.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return companies.map(
      (company) =>
        new CompanyResponseDto({
          id: company.id,
          name: company.name,
          phoneNumber: company.phoneNumber,
          email: company.email,
          websiteUrl: company.websiteUrl,
          recruitYearId: company.recruitYearId,
        }),
    );
  }

  async findOne({ id }: { id: string }): Promise<CompanyResponseDto | null> {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      return null;
    }

    return new CompanyResponseDto({
      id: company.id,
      name: company.name,
      phoneNumber: company.phoneNumber,
      email: company.email,
      websiteUrl: company.websiteUrl,
      recruitYearId: company.recruitYearId,
    });
  }
}
