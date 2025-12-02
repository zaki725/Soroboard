import { Injectable, Inject } from '@nestjs/common';
import type { IFacultyRepository } from '../../domain/faculty/faculty.repository.interface';
import type { IDeviationValueRepository } from '../../domain/deviation-value/deviation-value.repository.interface';
import { FacultyEntity } from '../../domain/faculty/faculty.entity';
import { DeviationValueEntity } from '../../domain/deviation-value/deviation-value.entity';
import { FacultyResponseDto } from '../../../query/dto/faculty/faculty.dto';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { CREATE, UPDATE, DELETE } from '../../../common/constants';
import { FacultyDao } from '../../../query/dao/faculty/faculty.dao';
import { FacultyBulkService } from './faculty-bulk.service';

type CreateParams = {
  name: string;
  universityId: string;
  deviationValue?: number;
  userId: string;
};

type UpdateParams = {
  id: string;
  name: string;
  deviationValue?: number;
  userId: string;
};

type DeleteParams = {
  id: string;
  userId: string;
};

@Injectable()
export class FacultyService {
  constructor(
    @Inject(INJECTION_TOKENS.IFacultyRepository)
    private readonly facultyRepository: IFacultyRepository,
    @Inject(INJECTION_TOKENS.IDeviationValueRepository)
    private readonly deviationValueRepository: IDeviationValueRepository,
    private readonly facultyDao: FacultyDao,
    private readonly facultyBulkService: FacultyBulkService,
  ) {}

  async create(params: CreateParams): Promise<FacultyResponseDto> {
    if (!params.userId) {
      throw new BadRequestError(CREATE.USER_ID_REQUIRED);
    }

    const createEntity = FacultyEntity.createNew({
      name: params.name,
      universityId: params.universityId,
      createdBy: params.userId,
      updatedBy: params.userId,
    });

    const created = await this.facultyRepository.create(createEntity);

    if (params.deviationValue !== undefined) {
      await this.createOrUpdateDeviationValue({
        facultyId: created.id,
        value: params.deviationValue,
        userId: params.userId,
      });
    }

    const facultyWithRelations = await this.facultyDao.findOne({
      id: created.id,
    });

    if (!facultyWithRelations) {
      throw new BadRequestError('学部の作成に失敗しました');
    }

    return facultyWithRelations;
  }

  async update(params: UpdateParams): Promise<FacultyResponseDto> {
    if (!params.id) {
      throw new BadRequestError(UPDATE.ID_REQUIRED);
    }

    if (!params.userId) {
      throw new BadRequestError(UPDATE.USER_ID_REQUIRED);
    }

    const existing = await this.facultyRepository.findOne({ id: params.id });

    if (!existing) {
      throw new NotFoundError('学部', params.id);
    }

    existing.changeName({ name: params.name, updatedBy: params.userId });

    await this.facultyRepository.update(existing);

    if (params.deviationValue !== undefined) {
      await this.createOrUpdateDeviationValue({
        facultyId: params.id,
        value: params.deviationValue,
        userId: params.userId,
      });
    }

    const facultyWithRelations = await this.facultyDao.findOne({
      id: params.id,
    });

    if (!facultyWithRelations) {
      throw new BadRequestError('学部の更新に失敗しました');
    }

    return facultyWithRelations;
  }

  async delete(params: DeleteParams): Promise<void> {
    if (!params.id) {
      throw new BadRequestError(DELETE.ID_REQUIRED);
    }

    if (!params.userId) {
      throw new BadRequestError(DELETE.USER_ID_REQUIRED);
    }

    await this.facultyRepository.delete({ id: params.id });
  }

  async bulkCreate(params: {
    universityId: string;
    faculties: Array<{
      name: string;
      deviationValue?: number;
    }>;
    userId: string;
  }): Promise<FacultyResponseDto[]> {
    return this.facultyBulkService.bulkCreate(params);
  }

  private async createOrUpdateDeviationValue({
    facultyId,
    value,
    userId,
  }: {
    facultyId: string;
    value: number;
    userId: string;
  }) {
    const facultyWithRelations = await this.facultyDao.findOne({
      id: facultyId,
    });

    if (facultyWithRelations?.deviationValue) {
      const existing = await this.deviationValueRepository.findOne({
        id: facultyWithRelations.deviationValue.id,
      });
      if (existing) {
        existing.changeValue({ value, updatedBy: userId });
        await this.deviationValueRepository.update(existing);
      }
    } else {
      const createEntity = DeviationValueEntity.createNew({
        facultyId,
        value,
        createdBy: userId,
        updatedBy: userId,
      });
      await this.deviationValueRepository.create(createEntity);
    }
  }
}
