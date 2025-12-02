import { Module } from '@nestjs/common';
import { SearchConditionController } from '../../command/controller/search-condition/search-condition.controller';
import { SearchConditionService } from '../../command/application/search-condition/search-condition.service';
import { SearchConditionRepository } from '../../command/infra/search-condition/search-condition.repository';
import { INJECTION_TOKENS } from '../../command/constants/injection-tokens';

@Module({
  controllers: [SearchConditionController],
  providers: [
    SearchConditionService,
    {
      provide: INJECTION_TOKENS.ISearchConditionRepository,
      useClass: SearchConditionRepository,
    },
  ],
})
export class SearchConditionCommandModule {}
