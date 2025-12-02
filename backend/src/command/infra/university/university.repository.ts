import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { UniversityEntity } from '../../domain/university/university.entity';
import { IUniversityRepository } from '../../domain/university/university.repository.interface';
import { UniversityMapper } from '../../domain/university/university.mapper';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { DELETE } from '../../../common/constants';
import { handlePrismaError } from '../../../common/utils/prisma-error-handler';
import { CustomLoggerService } from '../../../config/custom-logger.service';

@Injectable()
export class UniversityRepository implements IUniversityRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(university: UniversityEntity): Promise<UniversityEntity> {
    try {
      const universityData = await this.prisma.university.create({
        data: UniversityMapper.toPersistence(university),
      });

      return UniversityMapper.toDomain(universityData);
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'UniversityRepository',
      );
      handlePrismaError(error, {
        resourceName: '大学',
        id: university.id,
        duplicateMessage: 'この大学名は既に登録されています',
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async update(university: UniversityEntity): Promise<UniversityEntity> {
    try {
      const universityData = await this.prisma.university.update({
        where: { id: university.id },
        data: UniversityMapper.toUpdatePersistence(university),
      });

      return UniversityMapper.toDomain(universityData);
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'UniversityRepository',
      );
      handlePrismaError(error, {
        resourceName: '大学',
        id: university.id || '',
        duplicateMessage: 'この大学名は既に登録されています',
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async delete({ id }: { id: string }): Promise<void> {
    try {
      await this.prisma.university.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'UniversityRepository',
      );
      handlePrismaError(error, {
        resourceName: '大学',
        id,
        foreignKeyHandler: () => {
          throw new BadRequestError(DELETE.FOREIGN_KEY_CONSTRAINT);
        },
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async findOne({ id }: { id: string }): Promise<UniversityEntity | null> {
    const universityData = await this.prisma.university.findUnique({
      where: { id },
    });

    if (!universityData) {
      return null;
    }

    return UniversityMapper.toDomain(universityData);
  }
}
