import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  DeviationValueEntity,
  CreateDeviationValueEntity,
  UpdateDeviationValueEntity,
} from '../../domain/deviation-value/deviation-value.entity';
import { IDeviationValueRepository } from '../../domain/deviation-value/deviation-value.repository.interface';
import { NotFoundError } from '../../../common/errors/not-found.error';

@Injectable()
export class DeviationValueRepository implements IDeviationValueRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    deviationValue: CreateDeviationValueEntity,
  ): Promise<DeviationValueEntity> {
    try {
      const deviationValueData = await this.prisma.deviationValue.create({
        data: {
          facultyId: deviationValue.facultyId,
          value: deviationValue.value,
          createdBy: deviationValue.createdBy,
          updatedBy: deviationValue.updatedBy,
        },
      });

      return DeviationValueEntity.create({
        id: deviationValueData.id,
        facultyId: deviationValueData.facultyId,
        value: deviationValueData.value,
        createdAt: deviationValueData.createdAt,
        createdBy: deviationValueData.createdBy,
        updatedAt: deviationValueData.updatedAt,
        updatedBy: deviationValueData.updatedBy,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new NotFoundError('学部', deviationValue.facultyId);
      }
      throw error;
    }
  }

  async update(
    deviationValue: UpdateDeviationValueEntity,
  ): Promise<DeviationValueEntity> {
    try {
      const deviationValueData = await this.prisma.deviationValue.update({
        where: { id: deviationValue.id },
        data: {
          value: deviationValue.value,
          updatedBy: deviationValue.updatedBy,
        },
      });

      return DeviationValueEntity.create({
        id: deviationValueData.id,
        facultyId: deviationValueData.facultyId,
        value: deviationValueData.value,
        createdAt: deviationValueData.createdAt,
        createdBy: deviationValueData.createdBy,
        updatedAt: deviationValueData.updatedAt,
        updatedBy: deviationValueData.updatedBy,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('偏差値', deviationValue.id || '');
      }
      throw error;
    }
  }

  async delete({ id }: { id: string }): Promise<void> {
    try {
      await this.prisma.deviationValue.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('偏差値', id);
      }
      throw error;
    }
  }
}
