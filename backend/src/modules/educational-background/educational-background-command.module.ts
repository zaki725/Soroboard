import { Module } from '@nestjs/common';
import { EducationalBackgroundController } from '../../command/controller/educational-background/educational-background.controller';
import { EducationalBackgroundService } from '../../command/application/educational-background/educational-background.service';
import { EducationalBackgroundRepository } from '../../command/infra/educational-background/educational-background.repository';
import { EducationalBackgroundDao } from '../../query/dao/educational-background/educational-background.dao';
import { INJECTION_TOKENS } from '../../command/constants/injection-tokens';

@Module({
  controllers: [EducationalBackgroundController],
  providers: [
    EducationalBackgroundService,
    {
      provide: INJECTION_TOKENS.IEducationalBackgroundRepository,
      useClass: EducationalBackgroundRepository,
    },
    EducationalBackgroundRepository,
    EducationalBackgroundDao,
  ],
  exports: [EducationalBackgroundService],
})
export class EducationalBackgroundCommandModule {}
