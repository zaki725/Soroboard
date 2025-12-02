import { Injectable, Inject } from '@nestjs/common';
import type { IDeviationValueRepository } from '../../domain/deviation-value/deviation-value.repository.interface';
import { DeviationValueEntity } from '../../domain/deviation-value/deviation-value.entity';
import { DeviationValueResponseDto } from '../../../query/dto/faculty/faculty.dto';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { CREATE, UPDATE, DELETE } from '../../../common/constants';
import { FacultyDao } from '../../../query/dao/faculty/faculty.dao';

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
    private readonly facultyDao: FacultyDao,
  ) {}

  async create(params: CreateParams): Promise<DeviationValueResponseDto> {
    if (!params.userId) {
      throw new BadRequestError(CREATE.USER_ID_REQUIRED);
    }

    const faculty = await this.facultyDao.findOne({
      id: params.facultyId,
    });

    if (!faculty) {
      throw new NotFoundError('学部', params.facultyId);
    }

    const existingDeviationValue = faculty.deviationValue;

    if (existingDeviationValue && 'id' in existingDeviationValue) {
      throw new BadRequestError('この学部には既に偏差値が登録されています');
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
    const existingFaculties = await this.facultyDao.findAllByUniversityId({
      universityId,
    });
    const existingFaculty = existingFaculties.find(
      (f) => f.name === facultyName,
    );

    if (!existingFaculty) {
      return;
    }

    await this.create({
      facultyId: existingFaculty.id,
      value,
      userId,
    });
  }
}
