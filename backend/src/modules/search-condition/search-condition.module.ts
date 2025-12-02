import { Module } from '@nestjs/common';
import { SearchConditionCommandModule } from './search-condition-command.module';
import { SearchConditionQueryModule } from './search-condition-query.module';

@Module({
  imports: [SearchConditionCommandModule, SearchConditionQueryModule],
})
export class SearchConditionModule {}
