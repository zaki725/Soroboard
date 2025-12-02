import { Module } from '@nestjs/common';
import { DepartmentController } from '../../query/controller/department/department.controller';
import { DepartmentService } from '../../query/application/department/department.service';
import { DepartmentDao } from '../../query/dao/department/department.dao';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService, DepartmentDao],
})
export class DepartmentQueryModule {}
