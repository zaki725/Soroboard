import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { DepartmentEntity } from '../../domain/department/department.entity';
import { IDepartmentRepository } from '../../domain/department/department.repository.interface';
import { DepartmentMapper } from '../../domain/department/department.mapper';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { DELETE } from '../../../common/constants';
import { handlePrismaError } from '../../../common/utils/prisma-error-handler';
import { CustomLoggerService } from '../../../config/custom-logger.service';

@Injectable()
export class DepartmentRepository implements IDepartmentRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

  async findOne({ id }: { id: string }): Promise<DepartmentEntity | null> {
    const departmentData = await this.prisma.department.findUnique({
      where: { id },
    });

    if (!departmentData) {
      return null;
    }

    return DepartmentMapper.toDomain(departmentData);
  }

  async create(department: DepartmentEntity): Promise<DepartmentEntity> {
    try {
      const departmentData = await this.prisma.department.create({
        data: DepartmentMapper.toPersistence(department),
      });

      return DepartmentMapper.toDomain(departmentData);
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'DepartmentRepository',
      );
      handlePrismaError(error, {
        resourceName: '部署',
        id: department.id || '',
        duplicateMessage: 'この部署名は既に登録されています',
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async update(department: DepartmentEntity): Promise<DepartmentEntity> {
    try {
      const departmentData = await this.prisma.department.update({
        where: { id: department.id },
        data: DepartmentMapper.toUpdatePersistence(department),
      });

      return DepartmentMapper.toDomain(departmentData);
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'DepartmentRepository',
      );
      handlePrismaError(error, {
        resourceName: '部署',
        id: department.id || '',
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async delete({ id }: { id: string }): Promise<void> {
    try {
      await this.prisma.department.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'DepartmentRepository',
      );
      handlePrismaError(error, {
        resourceName: '部署',
        id,
        foreignKeyHandler: () => {
          throw new BadRequestError(DELETE.FOREIGN_KEY_CONSTRAINT);
        },
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }
}
