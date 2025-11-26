import { Injectable, Inject } from '@nestjs/common';
import type { ISearchConditionRepository } from '../../domain/search-condition/search-condition.repository.interface';
import { SearchConditionEntity } from '../../domain/search-condition/search-condition.entity';
import { SearchConditionResponseDto } from '../../../query/dto/search-condition/search-condition-response.dto';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';
import { NotFoundError } from '../../../common/errors/not-found.error';

type CreateParams = {
  formType: string;
  name: string;
  urlParams: string;
  createdBy: string;
  recruitYearId: number | null;
};

@Injectable()
export class SearchConditionService {
  constructor(
    @Inject(INJECTION_TOKENS.ISearchConditionRepository)
    private readonly searchConditionRepository: ISearchConditionRepository,
  ) {}

  async create({
    formType,
    name,
    urlParams,
    createdBy,
    recruitYearId,
  }: CreateParams): Promise<SearchConditionResponseDto> {
    const entity = SearchConditionEntity.create({
      formType,
      name,
      urlParams,
      recruitYearId,
      createdBy,
      updatedBy: createdBy,
    });

    const created = await this.searchConditionRepository.create(entity);
    const createdWithId: SearchConditionEntity & { id: string } =
      created as SearchConditionEntity & { id: string };

    createdWithId.ensureId();

    return new SearchConditionResponseDto({
      id: createdWithId.id,
      formType: createdWithId.formType,
      name: createdWithId.name,
      urlParams: createdWithId.urlParams,
      recruitYearId: createdWithId.recruitYearId,
      createdAt: createdWithId.createdAt,
      updatedAt: createdWithId.updatedAt,
    });
  }

  async delete({ id }: { id: string }): Promise<void> {
    const existing = await this.searchConditionRepository.findById(id);

    if (!existing) {
      throw new NotFoundError('検索条件', id);
    }

    await this.searchConditionRepository.delete(id);
  }
}
