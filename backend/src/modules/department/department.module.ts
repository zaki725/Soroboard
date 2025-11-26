import { Module } from '@nestjs/common';
import { DepartmentQueryModule } from './department-query.module';
import { DepartmentCommandModule } from './department-command.module';

@Module({
  imports: [DepartmentQueryModule, DepartmentCommandModule],
})
export class DepartmentModule {}
