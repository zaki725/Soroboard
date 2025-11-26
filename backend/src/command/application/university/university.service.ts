import { Injectable, Inject } from '@nestjs/common';
import type { IUniversityRepository } from '../../domain/university/university.repository.interface';
import type { IUniversityRankRepository } from '../../domain/university-rank/university-rank.repository.interface';
import {
  UniversityEntity,
  CreateUniversityEntity,
  UpdateUniversityEntity,
} from '../../domain/university/university.entity';
import {
  CreateUniversityRankEntity,
  UpdateUniversityRankEntity,
} from '../../domain/university-rank/university-rank.entity';
import { UniversityResponseDto } from '../../../query/dto/university/university.dto';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { CREATE, UPDATE, DELETE } from '../../../common/constants';
import { UniversityRankLevel } from '@prisma/client';
import { UniversityBulkService } from './university-bulk.service';

type CreateParams = {
  name: string;
  rank?: UniversityRankLevel;
  userId: string;
};

type UpdateParams = {
  id: string;
  name: string;
  rank?: UniversityRankLevel;
  userId: string;
};

type DeleteParams = {
  id: string;
  userId: string;
};

@Injectable()
export class UniversityService {
  constructor(
    @Inject(INJECTION_TOKENS.IUniversityRepository)
    private readonly universityRepository: IUniversityRepository,
    @Inject(INJECTION_TOKENS.IUniversityRankRepository)
    private readonly universityRankRepository: IUniversityRankRepository,
    private readonly universityBulkService: UniversityBulkService,
  ) {}

  async create(params: CreateParams): Promise<UniversityResponseDto> {
    if (!params.userId) {
      throw new BadRequestError(CREATE.USER_ID_REQUIRED);
    }

    const createEntity = new CreateUniversityEntity({
      name: params.name,
      createdBy: params.userId,
      updatedBy: params.userId,
    });

    const created = await this.universityRepository.create(createEntity);

    if (params.rank) {
      const createRankEntity = new CreateUniversityRankEntity({
        universityId: created.id,
        rank: params.rank,
        createdBy: params.userId,
        updatedBy: params.userId,
      });
      await this.universityRankRepository.create(createRankEntity);
    }

    return this.toResponseDtoWithRank(created.id);
  }

  async update(params: UpdateParams): Promise<UniversityResponseDto> {
    if (!params.id) {
      throw new BadRequestError(UPDATE.ID_REQUIRED);
    }

    if (!params.userId) {
      throw new BadRequestError(UPDATE.USER_ID_REQUIRED);
    }

    // 既存のエンティティを取得
    const existingUniversityResult: UniversityEntity | null =
      await this.universityRepository.findOne({
        id: params.id,
      });

    if (!existingUniversityResult) {
      throw new NotFoundError('大学', params.id);
    }

    // エンティティの振る舞いメソッドを使用して更新
    // 値が変わったかどうかの判定はエンティティ側で処理する
    existingUniversityResult.changeName({
      name: params.name,
      updatedBy: params.userId,
    });

    // UpdateUniversityEntityに変換してリポジトリに渡す
    const updateEntity = new UpdateUniversityEntity({
      id: existingUniversityResult.id,
      name: existingUniversityResult.name,
      updatedBy: existingUniversityResult.updatedBy,
    });

    const updated = await this.universityRepository.update(updateEntity);

    const existingRank = await this.universityRankRepository.findByUniversityId(
      {
        universityId: updated.id,
      },
    );

    if (params.rank) {
      if (existingRank) {
        const updateRankEntity = new UpdateUniversityRankEntity({
          id: existingRank.id,
          rank: params.rank,
          updatedBy: params.userId,
        });
        await this.universityRankRepository.update(updateRankEntity);
      } else {
        const createRankEntity = new CreateUniversityRankEntity({
          universityId: updated.id,
          rank: params.rank,
          createdBy: params.userId,
          updatedBy: params.userId,
        });
        await this.universityRankRepository.create(createRankEntity);
      }
    } else if (existingRank) {
      await this.universityRankRepository.delete({ id: existingRank.id });
    }

    return this.toResponseDtoWithRank(updated.id);
  }

  async delete(params: DeleteParams): Promise<void> {
    if (!params.id) {
      throw new BadRequestError(DELETE.ID_REQUIRED);
    }

    if (!params.userId) {
      throw new BadRequestError(DELETE.USER_ID_REQUIRED);
    }

    await this.universityRepository.delete({ id: params.id });
  }

  private async toResponseDtoWithRank(
    universityId: string,
  ): Promise<UniversityResponseDto> {
    const university: UniversityEntity | null =
      await this.universityRepository.findOne({
        id: universityId,
      });

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

  async bulkCreate(params: {
    name: string;
    rank?: UniversityRankLevel;
    faculties: Array<{
      name: string;
      deviationValue?: number;
    }>;
    userId: string;
  }): Promise<UniversityResponseDto> {
    return this.universityBulkService.bulkCreate(params);
  }
}
