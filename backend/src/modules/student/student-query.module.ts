import { Module } from '@nestjs/common';
import { StudentController } from '../../query/controller/student/student.controller';
import { StudentService } from '../../query/application/student/student.service';
import { StudentSearchService } from '../../query/application/student/student-search.service';
import { StudentDao } from '../../query/dao/student/student.dao';
import { StudentSearchDao } from '../../query/dao/student/student-search.dao';

@Module({
  controllers: [StudentController],
  providers: [
    StudentService,
    StudentDao,
    StudentSearchService,
    StudentSearchDao,
  ],
})
export class StudentQueryModule {}

