import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DepartmentEntity } from '../../domain/department/department.entity';
import { IDepartmentRepository } from '../../domain/department/department.repository.interface';
import { DepartmentMapper } from '../../domain/department/department.mapper';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { DELETE } from '../../../common/constants';

@Injectable()
export class DepartmentRepository implements IDepartmentRepository {
  constructor(private readonly prisma: PrismaService) {}

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
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestError('この部署名は既に登録されています');
      }
      throw error;
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
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('部署', department.id);
      }
      throw error;
    }
  }

  async delete({ id }: { id: string }): Promise<void> {
    try {
      await this.prisma.department.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('部署', id);
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestError(DELETE.FOREIGN_KEY_CONSTRAINT);
      }
      throw error;
    }
  }
}
