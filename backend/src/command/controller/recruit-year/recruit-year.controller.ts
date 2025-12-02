import { Controller, Put, Post, Body } from '@nestjs/common';
import { RecruitYearService } from '../../application/recruit-year/recruit-year.service';
import type {
  UpdateRecruitYearRequestDto,
  CreateRecruitYearRequestDto,
} from '../../dto/recruit-year/recruit-year.dto';
import {
  updateRecruitYearRequestSchema,
  createRecruitYearRequestSchema,
} from '../../dto/recruit-year/recruit-year.dto';
import { RecruitYearResponseDto } from '../../../query/dto/recruit-year/recruit-year.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';

@Controller('recruit-years')
export class RecruitYearController {
  constructor(private readonly recruitYearService: RecruitYearService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createRecruitYearRequestSchema))
    dto: CreateRecruitYearRequestDto,
  ): Promise<RecruitYearResponseDto> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return this.recruitYearService.upsert({
      recruitYear: dto.recruitYear,
      displayName: dto.displayName,
      themeColor: dto.themeColor,
      userId,
    });
  }

  @Put()
  async update(
    @Body(new ZodValidationPipe(updateRecruitYearRequestSchema))
    dto: UpdateRecruitYearRequestDto,
  ): Promise<RecruitYearResponseDto> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return this.recruitYearService.upsert({
      recruitYear: dto.recruitYear,
      displayName: dto.displayName,
      themeColor: dto.themeColor,
      userId,
    });
  }
}
