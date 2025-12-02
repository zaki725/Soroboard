import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CompanyService } from '../../application/company/company.service';
import { CompanyResponseDto } from '../../dto/company/company.dto';
import {
  companyListQuerySchema,
  type CompanyListQueryDto,
} from '../../dto/company/company-list-query.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @ApiOperation({ summary: '会社一覧を取得' })
  @ApiQuery({ name: 'recruitYearId', required: true, description: '年度ID' })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'ID（カンマ/スペース区切り可）',
  })
  @ApiQuery({ name: 'search', required: false, description: '検索キーワード' })
  @ApiResponse({
    status: 200,
    description: '会社一覧を取得しました',
    type: [CompanyResponseDto],
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async findAll(
    @Query(new ZodValidationPipe(companyListQuerySchema))
    query: CompanyListQueryDto,
  ): Promise<CompanyResponseDto[]> {
    return this.companyService.findAll({
      recruitYearId: query.recruitYearId,
      id: query.id,
      search: query.search,
    });
  }
}
