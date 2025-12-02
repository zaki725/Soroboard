import { Injectable, Inject } from '@nestjs/common';
import type { IFacultyRepository } from '../../domain/faculty/faculty.repository.interface';
import type { IDeviationValueRepository } from '../../domain/deviation-value/deviation-value.repository.interface';
import { FacultyEntity } from '../../domain/faculty/faculty.entity';
import { DeviationValueEntity } from '../../domain/deviation-value/deviation-value.entity';
import { FacultyResponseDto } from '../../../query/dto/faculty/faculty.dto';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { CREATE } from '../../../common/constants';
import { FacultyDao } from '../../../query/dao/faculty/faculty.dao';

@Injectable()
export class FacultyBulkService {
  constructor(
    @Inject(INJECTION_TOKENS.IFacultyRepository)
    private readonly facultyRepository: IFacultyRepository,
    @Inject(INJECTION_TOKENS.IDeviationValueRepository)
    private readonly deviationValueRepository: IDeviationValueRepository,
    private readonly facultyDao: FacultyDao,
  ) {}

  async bulkCreate(params: {
    universityId: string;
    faculties: Array<{
      name: string;
      deviationValue?: number;
    }>;
    userId: string;
  }): Promise<FacultyResponseDto[]> {
    if (!params.userId) {
      throw new BadRequestError(CREATE.USER_ID_REQUIRED);
    }

    const results: FacultyResponseDto[] = [];

    for (const facultyData of params.faculties) {
      try {
        const createFacultyEntity = FacultyEntity.createNew({
          name: facultyData.name,
          universityId: params.universityId,
          createdBy: params.userId,
          updatedBy: params.userId,
        });
        const faculty =
          await this.facultyRepository.create(createFacultyEntity);

        if (facultyData.deviationValue !== undefined) {
          await this.createOrUpdateDeviationValue({
            facultyId: faculty.id,
            value: facultyData.deviationValue,
            userId: params.userId,
          });
        }

        const facultyWithRelations = await this.facultyDao.findOne({
          id: faculty.id,
        });

        if (facultyWithRelations) {
          results.push(facultyWithRelations);
        }
      } catch (error) {
        if (
          error instanceof BadRequestError &&
          error.message.includes('既に登録されています')
        ) {
          const existingFaculties = await this.facultyDao.findAllByUniversityId(
            {
              universityId: params.universityId,
            },
          );
          const existingFaculty = existingFaculties.find(
            (f) => f.name === facultyData.name,
          );

          if (existingFaculty && facultyData.deviationValue !== undefined) {
            await this.updateExistingFacultyDeviationValue({
              facultyId: existingFaculty.id,
              deviationValue: facultyData.deviationValue,
              userId: params.userId,
            });

            const updatedFaculty = await this.facultyDao.findOne({
              id: existingFaculty.id,
            });

            if (updatedFaculty) {
              results.push(updatedFaculty);
            }
          }
          continue;
        }
        throw error;
      }
    }

    return results;
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

  private async updateExistingFacultyDeviationValue({
    facultyId,
    deviationValue,
    userId,
  }: {
    facultyId: string;
    deviationValue: number;
    userId: string;
  }) {
    const facultyWithRelations = await this.facultyDao.findOne({
      id: facultyId,
    });

    if (!facultyWithRelations) {
      return;
    }

    if (facultyWithRelations.deviationValue) {
      const existing = await this.deviationValueRepository.findOne({
        id: facultyWithRelations.deviationValue.id,
      });
      if (existing) {
        existing.changeValue({ value: deviationValue, updatedBy: userId });
        await this.deviationValueRepository.update(existing);
      }
    } else {
      const createEntity = DeviationValueEntity.createNew({
        facultyId,
        value: deviationValue,
        createdBy: userId,
        updatedBy: userId,
      });
      await this.deviationValueRepository.create(createEntity);
    }
  }
}
