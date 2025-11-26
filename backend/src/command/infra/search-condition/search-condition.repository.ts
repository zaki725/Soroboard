import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { ISearchConditionRepository } from '../../domain/search-condition/search-condition.repository.interface';
import { SearchConditionEntity } from '../../domain/search-condition/search-condition.entity';
import { SearchConditionMapper } from '../../domain/search-condition/search-condition.mapper';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class SearchConditionRepository implements ISearchConditionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    searchCondition: SearchConditionEntity,
  ): Promise<SearchConditionEntity> {
    try {
      const searchConditionData = await this.prisma.searchCondition.create({
        data: SearchConditionMapper.toPersistence(searchCondition),
      });

      return SearchConditionMapper.toDomain(searchConditionData);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestError('この名前の検索条件は既に登録されています');
      }
      throw error;
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
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('検索条件', id);
      }
      throw error;
    }
  }
}
