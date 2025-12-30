import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { Prisma } from '@prisma/client';
import { SearchConditionResponseDto } from '../../dto/search-condition/search-condition-response.dto';

@Injectable()
export class SearchConditionDao {
  constructor(private readonly prisma: PrismaService) {}

  async findByFormType({
    formType,
  }: {
    formType: string;
  }): Promise<SearchConditionResponseDto[]> {
    const where: Prisma.SearchConditionWhereInput = {
      formType,
    };

    const searchConditions = await this.prisma.searchCondition.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return searchConditions.map(
      (searchCondition) =>
        new SearchConditionResponseDto({
          id: searchCondition.id,
          formType: searchCondition.formType,
          name: searchCondition.name,
          urlParams: searchCondition.urlParams,
          recruitYearId: searchCondition.recruitYearId,
          createdAt: searchCondition.createdAt,
          updatedAt: searchCondition.updatedAt,
        }),
    );
  }
}
