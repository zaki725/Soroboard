import { Controller, Get, Query } from '@nestjs/common';
import { SearchConditionService } from '../../application/search-condition/search-condition.service';
import { SearchConditionResponseDto } from '../../dto/search-condition/search-condition-response.dto';
import {
  searchConditionListQuerySchema,
  type SearchConditionListQueryDto,
} from '../../dto/search-condition/search-condition-list-query.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';

@Controller('search-conditions')
export class SearchConditionController {
  constructor(
    private readonly searchConditionService: SearchConditionService,
  ) {}

  @Get()
  async findByFormType(
    @Query(new ZodValidationPipe(searchConditionListQuerySchema))
    query: SearchConditionListQueryDto,
  ): Promise<SearchConditionResponseDto[]> {
    return this.searchConditionService.findByFormType({
      formType: query.formType,
    });
  }
}
