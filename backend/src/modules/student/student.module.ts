import { Module } from '@nestjs/common';
import { StudentQueryModule } from './student-query.module';
import { StudentCommandModule } from './student-command.module';

@Module({
  imports: [StudentQueryModule, StudentCommandModule],
})
export class StudentModule {}

