import { Module } from '@nestjs/common';
import { RecruitYearController } from '../../command/controller/recruit-year/recruit-year.controller';
import { RecruitYearService } from '../../command/application/recruit-year/recruit-year.service';
import { RecruitYearRepository } from '../../command/infra/recruit-year/recruit-year.repository';
import { RecruitYearDao } from '../../query/dao/recruit-year/recruit-year.dao';
import { INJECTION_TOKENS } from '../../command/constants/injection-tokens';

@Module({
  controllers: [RecruitYearController],
  providers: [
    RecruitYearService,
    {
      provide: INJECTION_TOKENS.IRecruitYearRepository,
      useClass: RecruitYearRepository,
    },
    RecruitYearDao,
  ],
})
export class RecruitYearCommandModule {}
