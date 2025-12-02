import { Module } from '@nestjs/common';
import { RecruitYearController } from '../../query/controller/recruit-year/recruit-year.controller';
import { RecruitYearService } from '../../query/application/recruit-year/recruit-year.service';
import { RecruitYearDao } from '../../query/dao/recruit-year/recruit-year.dao';

@Module({
  controllers: [RecruitYearController],
  providers: [RecruitYearService, RecruitYearDao],
})
export class RecruitYearQueryModule {}
