import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { ISearchConditionRepository } from '../../domain/search-condition/search-condition.repository.interface';
import { SearchConditionEntity } from '../../domain/search-condition/search-condition.entity';
import { SearchConditionMapper } from '../../domain/search-condition/search-condition.mapper';
import { handlePrismaError } from '../../../common/utils/prisma-error-handler';
import { CustomLoggerService } from '../../../config/custom-logger.service';

@Injectable()
export class SearchConditionRepository implements ISearchConditionRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(
    searchCondition: SearchConditionEntity,
  ): Promise<SearchConditionEntity> {
    try {
      const searchConditionData = await this.prisma.searchCondition.create({
        data: SearchConditionMapper.toPersistence(searchCondition),
      });

      return SearchConditionMapper.toDomain(searchConditionData);
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'SearchConditionRepository',
      );
      handlePrismaError(error, {
        resourceName: '検索条件',
        id: searchCondition.id || '',
        duplicateMessage: 'この名前の検索条件は既に登録されています',
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async findById(id: string): Promise<SearchConditionEntity | null> {
    const data = await this.prisma.searchCondition.findUnique({
      where: { id },
    });

    if (!data) {
      return null;
    }

    return SearchConditionMapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.searchCondition.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'SearchConditionRepository',
      );
      handlePrismaError(error, {
        resourceName: '検索条件',
        id,
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }
}
