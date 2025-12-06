import { Module } from '@nestjs/common';
import { TeacherQueryModule } from './teacher-query.module';

@Module({
  imports: [TeacherQueryModule],
})
export class TeacherModule {}

