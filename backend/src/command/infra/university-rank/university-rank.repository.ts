import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  UniversityRankEntity,
  CreateUniversityRankEntity,
  UpdateUniversityRankEntity,
} from '../../domain/university-rank/university-rank.entity';
import { IUniversityRankRepository } from '../../domain/university-rank/university-rank.repository.interface';
import { NotFoundError } from '../../../common/errors/not-found.error';

@Injectable()
export class UniversityRankRepository implements IUniversityRankRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    rank: CreateUniversityRankEntity,
  ): Promise<UniversityRankEntity> {
    try {
      const rankData = await this.prisma.universityRank.create({
        data: {
          universityId: rank.universityId,
          rank: rank.rank,
          createdBy: rank.createdBy,
          updatedBy: rank.updatedBy,
        },
      });

      return UniversityRankEntity.create({
        id: rankData.id,
        universityId: rankData.universityId,
        rank: rankData.rank,
        createdAt: rankData.createdAt,
        createdBy: rankData.createdBy,
        updatedAt: rankData.updatedAt,
        updatedBy: rankData.updatedBy,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new NotFoundError('大学', rank.universityId);
      }
      throw error;
    }
  }

  async update(
    rank: UpdateUniversityRankEntity,
  ): Promise<UniversityRankEntity> {
    try {
      const rankData = await this.prisma.universityRank.update({
        where: { id: rank.id },
        data: {
          rank: rank.rank,
          updatedBy: rank.updatedBy,
        },
      });

      return UniversityRankEntity.create({
        id: rankData.id,
        universityId: rankData.universityId,
        rank: rankData.rank,
        createdAt: rankData.createdAt,
        createdBy: rankData.createdBy,
        updatedAt: rankData.updatedAt,
        updatedBy: rankData.updatedBy,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('大学ランク', rank.id || '');
      }
      throw error;
    }
  }

  async delete({ id }: { id: string }): Promise<void> {
    try {
      await this.prisma.universityRank.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('大学ランク', id);
      }
      throw error;
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

    return UniversityRankEntity.create({
      id: rankData.id,
      universityId: rankData.universityId,
      rank: rankData.rank,
      createdAt: rankData.createdAt,
      createdBy: rankData.createdBy,
      updatedAt: rankData.updatedAt,
      updatedBy: rankData.updatedBy,
    });
  }
}
