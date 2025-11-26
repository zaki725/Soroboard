import { SearchConditionEntity } from './search-condition.entity';

export interface ISearchConditionRepository {
  create(
    searchCondition: SearchConditionEntity,
  ): Promise<SearchConditionEntity>;
  findById(id: string): Promise<SearchConditionEntity | null>;
  delete(id: string): Promise<void>;
}
