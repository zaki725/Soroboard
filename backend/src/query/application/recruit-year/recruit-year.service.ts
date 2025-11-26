import { Injectable } from '@nestjs/common';
import { RecruitYearDao } from '../../dao/recruit-year/recruit-year.dao';
import { RecruitYearResponseDto } from '../../dto/recruit-year/recruit-year.dto';

@Injectable()
export class RecruitYearService {
  constructor(private readonly recruitYearDao: RecruitYearDao) {}

  async findAll(): Promise<RecruitYearResponseDto[]> {
    const recruitYears = await this.recruitYearDao.findAll();

    return recruitYears;
  }
}
