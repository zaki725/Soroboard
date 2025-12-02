import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { FacultyEntity } from '../../domain/faculty/faculty.entity';
import { IFacultyRepository } from '../../domain/faculty/faculty.repository.interface';
import { FacultyMapper } from '../../domain/faculty/faculty.mapper';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { DELETE } from '../../../common/constants';
import { handlePrismaError } from '../../../common/utils/prisma-error-handler';
import { CustomLoggerService } from '../../../config/custom-logger.service';

@Injectable()
export class FacultyRepository implements IFacultyRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(faculty: FacultyEntity): Promise<FacultyEntity> {
    try {
      const facultyData = await this.prisma.faculty.create({
        data: FacultyMapper.toPersistence(faculty),
      });

      return FacultyMapper.toDomain(facultyData);
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'FacultyRepository',
      );
      handlePrismaError(error, {
        resourceName: '学部',
        id: faculty.id || '',
        duplicateMessage: 'この学部名は既にこの大学に登録されています',
        foreignKeyHandler: () => {
          throw new NotFoundError('大学', faculty.universityId);
        },
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async update(faculty: FacultyEntity): Promise<FacultyEntity> {
    try {
      const facultyData = await this.prisma.faculty.update({
        where: { id: faculty.id },
        data: FacultyMapper.toUpdatePersistence(faculty),
      });

      return FacultyMapper.toDomain(facultyData);
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'FacultyRepository',
      );
      handlePrismaError(error, {
        resourceName: '学部',
        id: faculty.id || '',
        duplicateMessage: 'この学部名は既にこの大学に登録されています',
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async delete({ id }: { id: string }): Promise<void> {
    try {
      await this.prisma.faculty.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'FacultyRepository',
      );
      handlePrismaError(error, {
        resourceName: '学部',
        id,
        foreignKeyHandler: () => {
          throw new BadRequestError(DELETE.FACULTY_FOREIGN_KEY_CONSTRAINT);
        },
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async findOne({ id }: { id: string }): Promise<FacultyEntity | null> {
    const facultyData = await this.prisma.faculty.findUnique({
      where: { id },
    });

    if (!facultyData) {
      return null;
    }

    return FacultyMapper.toDomain(facultyData);
  }
}
