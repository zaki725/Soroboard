import { Controller, Put, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CompanyService } from '../../application/company/company.service';
import type {
  UpdateCompanyRequestDto,
  CreateCompanyRequestDto,
} from '../../dto/company/company.dto';
import {
  updateCompanyRequestSchema,
  createCompanyRequestSchema,
} from '../../dto/company/company.dto';
import { CompanyResponseDto } from '../../../query/dto/company/company.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ summary: '会社を作成' })
  @ApiResponse({
    status: 201,
    description: '会社が正常に作成されました',
    type: CompanyResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async create(
    @Body(new ZodValidationPipe(createCompanyRequestSchema))
    dto: CreateCompanyRequestDto,
  ): Promise<CompanyResponseDto> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return this.companyService.create({
      name: dto.name,
      phoneNumber: dto.phoneNumber,
      email: dto.email,
      websiteUrl: dto.websiteUrl,
      recruitYearId: dto.recruitYearId,
      userId,
    });
  }

  @Put()
  @ApiOperation({ summary: '会社を更新' })
  @ApiResponse({
    status: 200,
    description: '会社が正常に更新されました',
    type: CompanyResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({ status: 404, description: '会社が見つかりません' })
  async update(
    @Body(new ZodValidationPipe(updateCompanyRequestSchema))
    dto: UpdateCompanyRequestDto,
  ): Promise<CompanyResponseDto> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return this.companyService.update({
      id: dto.id,
      name: dto.name,
      phoneNumber: dto.phoneNumber,
      email: dto.email,
      websiteUrl: dto.websiteUrl,
      recruitYearId: dto.recruitYearId,
      userId,
    });
  }
}
