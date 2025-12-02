import { Module } from '@nestjs/common';
import { DepartmentController } from '../../command/controller/department/department.controller';
import { DepartmentService } from '../../command/application/department/department.service';
import { DepartmentRepository } from '../../command/infra/department/department.repository';
import { INJECTION_TOKENS } from '../../command/constants/injection-tokens';

@Module({
  controllers: [DepartmentController],
  providers: [
    DepartmentService,
    {
      provide: INJECTION_TOKENS.IDepartmentRepository,
      useClass: DepartmentRepository,
    },
  ],
})
export class DepartmentCommandModule {}
