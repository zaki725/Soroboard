import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  FacultyEntity,
  CreateFacultyEntity,
  UpdateFacultyEntity,
} from '../../domain/faculty/faculty.entity';
import { IFacultyRepository } from '../../domain/faculty/faculty.repository.interface';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { DELETE } from '../../../common/constants';

@Injectable()
export class FacultyRepository implements IFacultyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(faculty: CreateFacultyEntity): Promise<FacultyEntity> {
    try {
      const facultyData = await this.prisma.faculty.create({
        data: {
          name: faculty.name,
          universityId: faculty.universityId,
          createdBy: faculty.createdBy,
          updatedBy: faculty.updatedBy,
        },
      });

      return FacultyEntity.create({
        id: facultyData.id,
        name: facultyData.name,
        universityId: facultyData.universityId,
        createdAt: facultyData.createdAt,
        createdBy: facultyData.createdBy,
        updatedAt: facultyData.updatedAt,
        updatedBy: facultyData.updatedBy,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestError('この学部名は既にこの大学に登録されています');
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new NotFoundError('大学', faculty.universityId);
      }
      throw error;
    }
  }

  async update(faculty: UpdateFacultyEntity): Promise<FacultyEntity> {
    try {
      const facultyData = await this.prisma.faculty.update({
        where: { id: faculty.id },
        data: {
          name: faculty.name,
          updatedBy: faculty.updatedBy,
        },
      });

      return FacultyEntity.create({
        id: facultyData.id,
        name: facultyData.name,
        universityId: facultyData.universityId,
        createdAt: facultyData.createdAt,
        createdBy: facultyData.createdBy,
        updatedAt: facultyData.updatedAt,
        updatedBy: facultyData.updatedBy,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('学部', faculty.id || '');
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestError('この学部名は既にこの大学に登録されています');
      }
      throw error;
    }
  }

  async delete({ id }: { id: string }): Promise<void> {
    try {
      await this.prisma.faculty.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('学部', id);
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestError(DELETE.FACULTY_FOREIGN_KEY_CONSTRAINT);
      }
      throw error;
    }
  }
}
