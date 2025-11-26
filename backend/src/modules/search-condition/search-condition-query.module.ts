import { Module } from '@nestjs/common';
import { SearchConditionController } from '../../query/controller/search-condition/search-condition.controller';
import { SearchConditionService } from '../../query/application/search-condition/search-condition.service';
import { SearchConditionDao } from '../../query/dao/search-condition/search-condition.dao';

@Module({
  controllers: [SearchConditionController],
  providers: [SearchConditionService, SearchConditionDao],
})
export class SearchConditionQueryModule {}
