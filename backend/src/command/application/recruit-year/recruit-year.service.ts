import { Injectable, Inject } from '@nestjs/common';
import type { IRecruitYearRepository } from '../../domain/recruit-year/recruit-year.repository.interface';
import { RecruitYearResponseDto } from '../../../query/dto/recruit-year/recruit-year.dto';
import { RecruitYearDao } from '../../../query/dao/recruit-year/recruit-year.dao';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';

type UpsertParams = {
  recruitYear: number;
  displayName: string;
  themeColor: string;
  userId: string;
};

@Injectable()
export class RecruitYearService {
  constructor(
    @Inject(INJECTION_TOKENS.IRecruitYearRepository)
    private readonly recruitYearRepository: IRecruitYearRepository,
    private readonly recruitYearDao: RecruitYearDao,
  ) {}

  async upsert(params: UpsertParams): Promise<RecruitYearResponseDto> {
    const existing = await this.recruitYearDao.findOne({
      recruitYear: params.recruitYear,
    });
    return existing
      ? this.updateRecruitYear(params)
      : this.createRecruitYear(params);
  }

  private async createRecruitYear(
    params: UpsertParams,
  ): Promise<RecruitYearResponseDto> {
    const created = await this.recruitYearRepository.create({
      ...params,
      createdBy: params.userId,
      updatedBy: params.userId,
    });
    return new RecruitYearResponseDto({
      recruitYear: created.recruitYear,
      displayName: created.displayName,
      themeColor: created.themeColor,
    });
  }

  private async updateRecruitYear(
    params: UpsertParams,
  ): Promise<RecruitYearResponseDto> {
    const updated = await this.recruitYearRepository.update({
      recruitYear: params.recruitYear,
      displayName: params.displayName,
      themeColor: params.themeColor,
      updatedBy: params.userId,
    });
    return new RecruitYearResponseDto({
      recruitYear: updated.recruitYear,
      displayName: updated.displayName,
      themeColor: updated.themeColor,
    });
  }
}
