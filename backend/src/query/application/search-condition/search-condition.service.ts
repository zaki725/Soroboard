import { Injectable } from '@nestjs/common';
import { SearchConditionDao } from '../../dao/search-condition/search-condition.dao';
import { SearchConditionResponseDto } from '../../dto/search-condition/search-condition-response.dto';

@Injectable()
export class SearchConditionService {
  constructor(private readonly searchConditionDao: SearchConditionDao) {}

  async findByFormTypeAndRecruitYearId({
    formType,
    recruitYearId,
  }: {
    formType: string;
    recruitYearId: number;
  }): Promise<SearchConditionResponseDto[]> {
    const searchConditions =
      await this.searchConditionDao.findByFormTypeAndRecruitYearId({
        formType,
        recruitYearId,
      });

    return searchConditions;
  }
}
