import { Module } from '@nestjs/common';
import { RecruitYearQueryModule } from './recruit-year-query.module';
import { RecruitYearCommandModule } from './recruit-year-command.module';

@Module({
  imports: [RecruitYearQueryModule, RecruitYearCommandModule],
})
export class RecruitYearModule {}
