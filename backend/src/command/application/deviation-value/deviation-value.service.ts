import { Injectable, Inject } from '@nestjs/common';
import type { IDeviationValueRepository } from '../../domain/deviation-value/deviation-value.repository.interface';
import { DeviationValueEntity } from '../../domain/deviation-value/deviation-value.entity';
import { DeviationValueResponseDto } from '../../../query/dto/deviation-value/deviation-value.dto';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { CREATE, UPDATE, DELETE } from '../../../common/constants';

type CreateParams = {
  facultyId: string;
  value: number;
  userId: string;
};

type UpdateParams = {
  id: string;
  value: number;
  userId: string;
};

type DeleteParams = {
  id: string;
  userId: string;
};

@Injectable()
export class DeviationValueService {
  constructor(
    @Inject(INJECTION_TOKENS.IDeviationValueRepository)
    private readonly deviationValueRepository: IDeviationValueRepository,
  ) {}

  async create(params: CreateParams): Promise<DeviationValueResponseDto> {
    if (!params.userId) {
      throw new BadRequestError(CREATE.USER_ID_REQUIRED);
    }

    const createEntity = DeviationValueEntity.createNew({
      facultyId: params.facultyId,
      value: params.value,
      createdBy: params.userId,
      updatedBy: params.userId,
    });

    const created = await this.deviationValueRepository.create(createEntity);

    return new DeviationValueResponseDto({
      id: created.id,
      facultyId: created.facultyId,
      value: created.value,
    });
  }

  async update(params: UpdateParams): Promise<DeviationValueResponseDto> {
    if (!params.id) {
      throw new BadRequestError(UPDATE.ID_REQUIRED);
    }

    if (!params.userId) {
      throw new BadRequestError(UPDATE.USER_ID_REQUIRED);
    }

    const existing = await this.deviationValueRepository.findOne({
      id: params.id,
    });

    if (!existing) {
      throw new NotFoundError('偏差値', params.id);
    }

    existing.changeValue({ value: params.value, updatedBy: params.userId });

    const updated = await this.deviationValueRepository.update(existing);

    return new DeviationValueResponseDto({
      id: updated.id,
      facultyId: updated.facultyId,
      value: updated.value,
    });
  }

  async delete(params: DeleteParams): Promise<void> {
    if (!params.id) {
      throw new BadRequestError(DELETE.ID_REQUIRED);
    }

    if (!params.userId) {
      throw new BadRequestError(DELETE.USER_ID_REQUIRED);
    }

    await this.deviationValueRepository.delete({ id: params.id });
  }

  async createOrUpdateByFacultyId({
    facultyId,
    value,
    userId,
  }: {
    facultyId: string;
    value: number;
    userId: string;
  }): Promise<void> {
    await this.create({
      facultyId,
      value,
      userId,
    });
  }

  async updateByFacultyName({
    universityId,
    facultyName,
    value,
    userId,
  }: {
    universityId: string;
    facultyName: string;
    value: number;
    userId: string;
  }): Promise<void> {
    // facultyが削除されたため、このメソッドは使用不可
    // 必要に応じて実装を変更してください
    throw new BadRequestError('この機能は使用できません');
  }
}
