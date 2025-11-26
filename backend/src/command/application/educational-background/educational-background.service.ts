import { Injectable, Inject } from '@nestjs/common';
import type { IEducationalBackgroundRepository } from '../../domain/educational-background/educational-background.repository.interface';
import {
  CreateEducationalBackgroundEntity,
  UpdateEducationalBackgroundEntity,
  type EducationType,
} from '../../domain/educational-background/educational-background.entity';
import { EducationalBackgroundResponseDto } from '../../../query/dto/educational-background/educational-background.dto';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { CREATE, UPDATE, DELETE } from '../../../common/constants';
import { EducationalBackgroundDao } from '../../../query/dao/educational-background/educational-background.dao';

type CreateParams = {
  interviewerId: string;
  educationType: EducationType;
  universityId?: string;
  facultyId?: string;
  graduationYear?: number;
  graduationMonth?: number;
  userId: string;
};

type UpdateParams = {
  id: string;
  educationType: EducationType;
  universityId?: string;
  facultyId?: string;
  graduationYear?: number;
  graduationMonth?: number;
  userId: string;
};

type DeleteParams = {
  id: string;
  userId: string;
};

@Injectable()
export class EducationalBackgroundService {
  constructor(
    @Inject(INJECTION_TOKENS.IEducationalBackgroundRepository)
    private readonly educationalBackgroundRepository: IEducationalBackgroundRepository,
    private readonly educationalBackgroundDao: EducationalBackgroundDao,
  ) {}

  async create(
    params: CreateParams,
  ): Promise<EducationalBackgroundResponseDto> {
    if (!params.userId) {
      throw new BadRequestError(CREATE.USER_ID_REQUIRED);
    }

    const createEntity = new CreateEducationalBackgroundEntity({
      interviewerId: params.interviewerId,
      educationType: params.educationType,
      universityId: params.universityId,
      facultyId: params.facultyId,
      graduationYear: params.graduationYear,
      graduationMonth: params.graduationMonth,
      createdBy: params.userId,
      updatedBy: params.userId,
    });

    const created =
      await this.educationalBackgroundRepository.create(createEntity);

    const educationalBackgroundWithRelations =
      await this.educationalBackgroundDao.findOne({
        id: created.id,
      });

    if (!educationalBackgroundWithRelations) {
      throw new BadRequestError(CREATE.FAILED);
    }

    return educationalBackgroundWithRelations;
  }

  async update(
    params: UpdateParams,
  ): Promise<EducationalBackgroundResponseDto> {
    if (!params.id) {
      throw new BadRequestError(UPDATE.ID_REQUIRED);
    }

    if (!params.userId) {
      throw new BadRequestError(UPDATE.USER_ID_REQUIRED);
    }

    const updateEntity = new UpdateEducationalBackgroundEntity({
      id: params.id,
      educationType: params.educationType,
      universityId: params.universityId,
      facultyId: params.facultyId,
      graduationYear: params.graduationYear,
      graduationMonth: params.graduationMonth,
      updatedBy: params.userId,
    });

    await this.educationalBackgroundRepository.update(updateEntity);

    const educationalBackgroundWithRelations =
      await this.educationalBackgroundDao.findOne({
        id: params.id,
      });

    if (!educationalBackgroundWithRelations) {
      throw new BadRequestError(UPDATE.FAILED);
    }

    return educationalBackgroundWithRelations;
  }

  async delete(params: DeleteParams): Promise<void> {
    if (!params.id) {
      throw new BadRequestError(DELETE.ID_REQUIRED);
    }

    if (!params.userId) {
      throw new BadRequestError(DELETE.USER_ID_REQUIRED);
    }

    await this.educationalBackgroundRepository.delete({ id: params.id });
  }

  async findAllByInterviewerId({
    interviewerId,
  }: {
    interviewerId: string;
  }): Promise<EducationalBackgroundResponseDto[]> {
    const educationalBackgroundsWithRelations =
      await this.educationalBackgroundDao.findAllByInterviewerId({
        interviewerId,
      });

    return educationalBackgroundsWithRelations;
  }
}
