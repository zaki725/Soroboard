import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  UniversityEntity,
  CreateUniversityEntity,
  UpdateUniversityEntity,
} from '../../domain/university/university.entity';
import { IUniversityRepository } from '../../domain/university/university.repository.interface';
import { UniversityMapper } from '../../domain/university/university.mapper';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { DELETE } from '../../../common/constants';

@Injectable()
export class UniversityRepository implements IUniversityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(university: CreateUniversityEntity): Promise<UniversityEntity> {
    try {
      const universityData = await this.prisma.university.create({
        data: {
          name: university.name,
          createdBy: university.createdBy,
          updatedBy: university.updatedBy,
        },
      });

      return UniversityMapper.toDomain(universityData);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestError('この大学名は既に登録されています');
      }
      throw error;
    }
  }

  async update(university: UpdateUniversityEntity): Promise<UniversityEntity> {
    try {
      const universityData = await this.prisma.university.update({
        where: { id: university.id },
        data: {
          name: university.name,
          updatedBy: university.updatedBy,
        },
      });

      return UniversityMapper.toDomain(universityData);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('大学', university.id || '');
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestError('この大学名は既に登録されています');
      }
      throw error;
    }
  }

  async delete({ id }: { id: string }): Promise<void> {
    try {
      await this.prisma.university.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('大学', id);
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
