import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { DeviationValueEntity } from '../../domain/deviation-value/deviation-value.entity';
import { IDeviationValueRepository } from '../../domain/deviation-value/deviation-value.repository.interface';
import { DeviationValueMapper } from '../../domain/deviation-value/deviation-value.mapper';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { handlePrismaError } from '../../../common/utils/prisma-error-handler';
import { CustomLoggerService } from '../../../config/custom-logger.service';

@Injectable()
export class DeviationValueRepository implements IDeviationValueRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(
    deviationValue: DeviationValueEntity,
  ): Promise<DeviationValueEntity> {
    try {
      const deviationValueData = await this.prisma.deviationValue.create({
        data: DeviationValueMapper.toPersistence(deviationValue),
      });

      return DeviationValueMapper.toDomain(deviationValueData);
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'DeviationValueRepository',
      );
      handlePrismaError(error, {
        resourceName: '偏差値',
        id: deviationValue.id,
        foreignKeyHandler: () => {
          throw new NotFoundError('学部', deviationValue.facultyId);
        },
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async update(
    deviationValue: DeviationValueEntity,
  ): Promise<DeviationValueEntity> {
    try {
      const deviationValueData = await this.prisma.deviationValue.update({
        where: { id: deviationValue.id },
        data: DeviationValueMapper.toUpdatePersistence(deviationValue),
      });

      return DeviationValueMapper.toDomain(deviationValueData);
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'DeviationValueRepository',
      );
      handlePrismaError(error, {
        resourceName: '偏差値',
        id: deviationValue.id || '',
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async delete({ id }: { id: string }): Promise<void> {
    try {
      await this.prisma.deviationValue.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'DeviationValueRepository',
      );
      handlePrismaError(error, {
        resourceName: '偏差値',
        id,
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async findOne({ id }: { id: string }): Promise<DeviationValueEntity | null> {
    const deviationValueData = await this.prisma.deviationValue.findUnique({
      where: { id },
    });

    if (!deviationValueData) {
      return null;
    }

    return DeviationValueMapper.toDomain(deviationValueData);
  }
}
