import { Module } from '@nestjs/common';
import { StudentController } from '../../query/controller/student/student.controller';
import { StudentService } from '../../query/application/student/student.service';
import { StudentDao } from '../../query/dao/student/student.dao';

@Module({
  controllers: [StudentController],
  providers: [StudentService, StudentDao],
})
export class StudentQueryModule {}

