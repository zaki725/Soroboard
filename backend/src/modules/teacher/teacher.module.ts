import { Module } from '@nestjs/common';
import { TeacherQueryModule } from './teacher-query.module';
import { TeacherCommandModule } from './teacher-command.module';

@Module({
  imports: [TeacherQueryModule, TeacherCommandModule],
})
export class TeacherModule {}

