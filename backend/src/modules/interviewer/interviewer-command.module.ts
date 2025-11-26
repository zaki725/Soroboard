import { Module } from '@nestjs/common';
import { InterviewerController } from '../../command/controller/interviewer/interviewer.controller';
import { InterviewerService } from '../../command/application/interviewer/interviewer.service';
import { InterviewerBulkService } from '../../command/application/interviewer/interviewer-bulk.service';
import { InterviewerRepository } from '../../command/infra/interviewer/interviewer.repository';
import { INJECTION_TOKENS } from '../../command/constants/injection-tokens';

@Module({
  controllers: [InterviewerController],
  providers: [
    InterviewerService,
    InterviewerBulkService,
    {
      provide: INJECTION_TOKENS.IInterviewerRepository,
      useClass: InterviewerRepository,
    },
    InterviewerRepository,
  ],
})
export class InterviewerCommandModule {}
