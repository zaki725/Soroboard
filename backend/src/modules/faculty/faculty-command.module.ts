import { Module } from '@nestjs/common';
import { FacultyController } from '../../command/controller/faculty/faculty.controller';
import { FacultyService } from '../../command/application/faculty/faculty.service';
import { FacultyBulkService } from '../../command/application/faculty/faculty-bulk.service';
import { FacultyRepository } from '../../command/infra/faculty/faculty.repository';
import { DeviationValueRepository } from '../../command/infra/deviation-value/deviation-value.repository';
import { INJECTION_TOKENS } from '../../command/constants/injection-tokens';
import { FacultyQueryModule } from './faculty-query.module';

@Module({
  imports: [FacultyQueryModule],
  controllers: [FacultyController],
  providers: [
    FacultyService,
    FacultyBulkService,
    {
      provide: INJECTION_TOKENS.IFacultyRepository,
      useClass: FacultyRepository,
    },
    {
      provide: INJECTION_TOKENS.IDeviationValueRepository,
      useClass: DeviationValueRepository,
    },
  ],
})
export class FacultyCommandModule {}
