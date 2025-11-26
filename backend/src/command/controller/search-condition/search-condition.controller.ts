import { Controller, Post, Delete, Body, Param } from '@nestjs/common';
import { SearchConditionService } from '../../application/search-condition/search-condition.service';
import type { CreateSearchConditionRequestDto } from '../../dto/search-condition/search-condition-request.dto';
import { createSearchConditionRequestSchema } from '../../dto/search-condition/search-condition-request.dto';
import { SearchConditionResponseDto } from '../../../query/dto/search-condition/search-condition-response.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';

@Controller('search-conditions')
export class SearchConditionController {
  constructor(
    private readonly searchConditionService: SearchConditionService,
  ) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createSearchConditionRequestSchema))
    dto: CreateSearchConditionRequestDto,
  ): Promise<SearchConditionResponseDto> {
    // TODO: 認証情報からcreatedByを取得（現在はスタブ）
    const createdBy = 'system';

    return this.searchConditionService.create({
      formType: dto.formType,
      name: dto.name,
      urlParams: dto.urlParams,
      createdBy,
      recruitYearId: dto.recruitYearId ?? null,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.searchConditionService.delete({ id });
  }
}
