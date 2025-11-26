import { Module } from '@nestjs/common';
import { InterviewerQueryModule } from './interviewer-query.module';
import { InterviewerCommandModule } from './interviewer-command.module';

@Module({
  imports: [InterviewerQueryModule, InterviewerCommandModule],
})
export class InterviewerModule {}
