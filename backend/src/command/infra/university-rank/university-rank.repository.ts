import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { UniversityRankEntity } from '../../domain/university-rank/university-rank.entity';
import { IUniversityRankRepository } from '../../domain/university-rank/university-rank.repository.interface';
import { UniversityRankMapper } from '../../domain/university-rank/university-rank.mapper';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { handlePrismaError } from '../../../common/utils/prisma-error-handler';
import { CustomLoggerService } from '../../../config/custom-logger.service';

@Injectable()
export class UniversityRankRepository implements IUniversityRankRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(rank: UniversityRankEntity): Promise<UniversityRankEntity> {
    try {
      const rankData = await this.prisma.universityRank.create({
        data: UniversityRankMapper.toPersistence(rank),
      });

      return UniversityRankMapper.toDomain(rankData);
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'UniversityRankRepository',
      );
      handlePrismaError(error, {
        resourceName: '大学ランク',
        id: rank.id,
        foreignKeyHandler: () => {
          throw new NotFoundError('大学', rank.universityId);
        },
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async update(rank: UniversityRankEntity): Promise<UniversityRankEntity> {
    try {
      const rankData = await this.prisma.universityRank.update({
        where: { id: rank.id },
        data: UniversityRankMapper.toUpdatePersistence(rank),
      });

      return UniversityRankMapper.toDomain(rankData);
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'UniversityRankRepository',
      );
      handlePrismaError(error, {
        resourceName: '大学ランク',
        id: rank.id || '',
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async delete({ id }: { id: string }): Promise<void> {
    try {
      await this.prisma.universityRank.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'UniversityRankRepository',
      );
      handlePrismaError(error, {
        resourceName: '大学ランク',
        id,
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async findByUniversityId({
    universityId,
  }: {
    universityId: string;
  }): Promise<UniversityRankEntity | null> {
    const rankData = await this.prisma.universityRank.findFirst({
      where: { universityId },
    });

    if (!rankData) {
      return null;
    }

    return UniversityRankMapper.toDomain(rankData);
  }
}
