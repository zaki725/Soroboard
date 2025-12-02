import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { EducationalBackgroundEntity } from '../../domain/educational-background/educational-background.entity';
import { EducationalBackgroundMapper } from '../../domain/educational-background/educational-background.mapper';
import { IEducationalBackgroundRepository } from '../../domain/educational-background/educational-background.repository.interface';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { handlePrismaError } from '../../../common/utils/prisma-error-handler';
import { CustomLoggerService } from '../../../config/custom-logger.service';

@Injectable()
export class EducationalBackgroundRepository
  implements IEducationalBackgroundRepository
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(
    educationalBackground: EducationalBackgroundEntity,
  ): Promise<EducationalBackgroundEntity> {
    if (!educationalBackground.createdBy) {
      throw new BadRequestError('createdBy は必須です');
    }
    try {
      const educationalBackgroundData =
        await this.prisma.educationalBackground.create({
          data: EducationalBackgroundMapper.toPersistence(
            educationalBackground,
          ),
        });

      return EducationalBackgroundMapper.toDomain(educationalBackgroundData);
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'EducationalBackgroundRepository',
      );
      handlePrismaError(error, {
        resourceName: '学歴',
        id: educationalBackground.id,
        foreignKeyHandler: () => {
          const getFieldName = (): string => {
            if (educationalBackground.universityId !== undefined) {
              return '大学';
            }
            if (educationalBackground.facultyId !== undefined) {
              return '学部';
            }
            return '面接官';
          };
          const field = getFieldName();
          const fieldId =
            educationalBackground.universityId ||
            educationalBackground.facultyId ||
            educationalBackground.interviewerId;
          throw new NotFoundError(field, fieldId);
        },
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async findOne({
    id,
  }: {
    id: string;
  }): Promise<EducationalBackgroundEntity | null> {
    const educationalBackgroundData =
      await this.prisma.educationalBackground.findUnique({
        where: { id },
      });

    if (!educationalBackgroundData) {
      return null;
    }

    return EducationalBackgroundMapper.toDomain(educationalBackgroundData);
  }

  async findAllByInterviewerId({
    interviewerId,
  }: {
    interviewerId: string;
  }): Promise<EducationalBackgroundEntity[]> {
    const educationalBackgrounds =
      await this.prisma.educationalBackground.findMany({
        where: { interviewerId },
        orderBy: [{ graduationYear: 'desc' }, { graduationMonth: 'desc' }],
      });

    return educationalBackgrounds.map((educationalBackground) =>
      EducationalBackgroundMapper.toDomain(educationalBackground),
    );
  }

  async update(
    educationalBackground: EducationalBackgroundEntity,
  ): Promise<EducationalBackgroundEntity> {
    try {
      const educationalBackgroundData =
        await this.prisma.educationalBackground.update({
          where: { id: educationalBackground.id },
          data: {
            educationType: educationalBackground.educationType,
            universityId: educationalBackground.universityId ?? null,
            facultyId: educationalBackground.facultyId ?? null,
            graduationYear: educationalBackground.graduationYear ?? null,
            graduationMonth: educationalBackground.graduationMonth ?? null,
            updatedBy: educationalBackground.updatedBy,
          },
        });

      return EducationalBackgroundMapper.toDomain(educationalBackgroundData);
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'EducationalBackgroundRepository',
      );
      handlePrismaError(error, {
        resourceName: '学歴',
        id: educationalBackground.id,
        foreignKeyHandler: () => {
          const getFieldName = (): string => {
            if (educationalBackground.universityId !== undefined) {
              return '大学';
            }
            if (educationalBackground.facultyId !== undefined) {
              return '学部';
            }
            return '学歴';
          };
          const field = getFieldName();
          throw new NotFoundError(
            field,
            educationalBackground.universityId ||
              educationalBackground.facultyId ||
              educationalBackground.id,
          );
        },
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async delete({ id }: { id: string }): Promise<void> {
    try {
      await this.prisma.educationalBackground.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'EducationalBackgroundRepository',
      );
      handlePrismaError(error, {
        resourceName: '学歴',
        id,
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }
}
