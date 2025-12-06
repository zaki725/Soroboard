import { Module } from '@nestjs/common';
import { TeacherController } from '../../query/controller/teacher/teacher.controller';
import { TeacherService } from '../../query/application/teacher/teacher.service';
import { TeacherDao } from '../../query/dao/teacher/teacher.dao';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService, TeacherDao],
})
export class TeacherQueryModule {}

