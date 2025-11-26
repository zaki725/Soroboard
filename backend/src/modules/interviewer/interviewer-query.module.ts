import { Module } from '@nestjs/common';
import { InterviewerController } from '../../query/controller/interviewer/interviewer.controller';
import { InterviewerService } from '../../query/application/interviewer/interviewer.service';
import { InterviewerDao } from '../../query/dao/interviewer/interviewer.dao';

@Module({
  controllers: [InterviewerController],
  providers: [InterviewerService, InterviewerDao],
})
export class InterviewerQueryModule {}
