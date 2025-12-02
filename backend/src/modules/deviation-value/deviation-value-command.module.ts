import { Module } from '@nestjs/common';
import { DeviationValueController } from '../../command/controller/deviation-value/deviation-value.controller';
import { DeviationValueService } from '../../command/application/deviation-value/deviation-value.service';
import { DeviationValueRepository } from '../../command/infra/deviation-value/deviation-value.repository';
import { INJECTION_TOKENS } from '../../command/constants/injection-tokens';
import { FacultyQueryModule } from '../faculty/faculty-query.module';

@Module({
  imports: [FacultyQueryModule],
  controllers: [DeviationValueController],
  providers: [
    DeviationValueService,
    {
      provide: INJECTION_TOKENS.IDeviationValueRepository,
      useClass: DeviationValueRepository,
    },
  ],
  exports: [DeviationValueService],
})
export class DeviationValueCommandModule {}
