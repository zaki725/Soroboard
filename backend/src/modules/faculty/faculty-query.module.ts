import { Module } from '@nestjs/common';
import { FacultyController } from '../../query/controller/faculty/faculty.controller';
import { FacultyService } from '../../query/application/faculty/faculty.service';
import { FacultyDao } from '../../query/dao/faculty/faculty.dao';

@Module({
  controllers: [FacultyController],
  providers: [FacultyService, FacultyDao],
  exports: [FacultyDao],
})
export class FacultyQueryModule {}
