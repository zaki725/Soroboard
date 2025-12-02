import { Module } from '@nestjs/common';
import { UniversityController } from '../../command/controller/university/university.controller';
import { UniversityService } from '../../command/application/university/university.service';
import { UniversityBulkService } from '../../command/application/university/university-bulk.service';
import { UniversityRepository } from '../../command/infra/university/university.repository';
import { UniversityRankRepository } from '../../command/infra/university-rank/university-rank.repository';
import { FacultyRepository } from '../../command/infra/faculty/faculty.repository';
import { UniversityDao } from '../../query/dao/university/university.dao';
import { FacultyQueryModule } from '../faculty/faculty-query.module';
import { DeviationValueCommandModule } from '../deviation-value/deviation-value-command.module';
import { FacultyDao } from '../../query/dao/faculty/faculty.dao';
import { INJECTION_TOKENS } from '../../command/constants/injection-tokens';

@Module({
  imports: [FacultyQueryModule, DeviationValueCommandModule],
  controllers: [UniversityController],
  providers: [
    UniversityService,
    UniversityBulkService,
    {
      provide: INJECTION_TOKENS.IUniversityRepository,
      useClass: UniversityRepository,
    },
    {
      provide: INJECTION_TOKENS.IUniversityRankRepository,
      useClass: UniversityRankRepository,
    },
    {
      provide: INJECTION_TOKENS.IFacultyRepository,
      useClass: FacultyRepository,
    },
    UniversityDao,
    FacultyDao,
  ],
})
export class UniversityCommandModule {}
