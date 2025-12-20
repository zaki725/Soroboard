import { Injectable, Inject } from '@nestjs/common';
import type { IUniversityRepository } from '../../domain/university/university.repository.interface';
import type { IUniversityRankRepository } from '../../domain/university-rank/university-rank.repository.interface';
import { UniversityEntity } from '../../domain/university/university.entity';
import { UniversityRankEntity } from '../../domain/university-rank/university-rank.entity';
import { UniversityResponseDto } from '../../../query/dto/university/university.dto';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { CREATE } from '../../../common/constants';
import { UniversityRankLevel } from '@prisma/client';
import { UniversityDao } from '../../../query/dao/university/university.dao';
import { PrismaService } from '../../../prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UniversityBulkService {
  constructor(
    @Inject(INJECTION_TOKENS.IUniversityRepository)
    private readonly universityRepository: IUniversityRepository,
    @Inject(INJECTION_TOKENS.IUniversityRankRepository)
    private readonly universityRankRepository: IUniversityRankRepository,
    private readonly universityDao: UniversityDao,
    private readonly prismaService: PrismaService,
  ) {}

  async bulkCreate(params: {
    name: string;
    rank?: UniversityRankLevel;
    faculties: Array<{
      name: string;
      deviationValue?: number;
    }>;
    userId: string;
  }): Promise<UniversityResponseDto> {
    if (!params.userId) {
      throw new BadRequestError(CREATE.USER_ID_REQUIRED);
    }

    return await this.prismaService.$transaction(async () => {
      const university = await this.findOrCreateUniversity({
        name: params.name,
        userId: params.userId,
      });

      await this.updateOrCreateUniversityRank({
        universityId: university.id,
        rank: params.rank,
        userId: params.userId,
      });

      // facultyが削除されたため、faculty関連の処理はスキップ
      // 必要に応じて実装を変更してください

      return this.toResponseDtoWithRank(university.id);
    });
  }

  private async findOrCreateUniversity({
    name,
    userId,
  }: {
    name: string;
    userId: string;
  }) {
    try {
      const createEntity = UniversityEntity.createNew({
        name,
        createdBy: userId,
        updatedBy: userId,
      });
      const created = await this.universityRepository.create(createEntity);
      const found = await this.universityDao.findOne({ id: created.id });

      if (!found) {
        throw new BadRequestError('大学の作成に失敗しました');
      }

      return found;
    } catch (error) {
      // If unique constraint error, fetch the existing university
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const existingUniversities = await this.universityDao.findAll({
          search: name,
        });
        const existingUniversity = existingUniversities.find(
          (u) => u.name === name,
        );
        if (existingUniversity) {
          return existingUniversity;
        }
      }
      throw error;
    }
  }

  private async updateOrCreateUniversityRank({
    universityId,
    rank,
    userId,
  }: {
    universityId: string;
    rank?: UniversityRankLevel;
    userId: string;
  }) {
    if (!rank) {
      return;
    }

    const existingRank = await this.universityRankRepository.findByUniversityId(
      {
        universityId,
      },
    );

    if (existingRank) {
      existingRank.rank = rank;
      existingRank.updatedBy = userId;
      await this.universityRankRepository.update(existingRank);
    } else {
      const createRankEntity = UniversityRankEntity.createNew({
        universityId,
        rank,
        createdBy: userId,
        updatedBy: userId,
      });
      await this.universityRankRepository.create(createRankEntity);
    }
  }


  private async toResponseDtoWithRank(
    universityId: string,
  ): Promise<UniversityResponseDto> {
    const university = await this.universityDao.findOne({ id: universityId });

    if (!university) {
      throw new BadRequestError('大学の取得に失敗しました');
    }

    const rank = await this.universityRankRepository.findByUniversityId({
      universityId,
    });

    return new UniversityResponseDto({
      id: university.id,
      name: university.name,
      rank: rank?.rank,
    });
  }
}
