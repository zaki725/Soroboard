import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { InterviewerEntity } from '../../domain/interviewer/interviewer.entity';
import { InterviewerMapper } from '../../domain/interviewer/interviewer.mapper';
import { IInterviewerRepository } from '../../domain/interviewer/interviewer.repository.interface';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { BadRequestError } from '../../../common/errors/bad-request.error';

@Injectable()
export class InterviewerRepository implements IInterviewerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(interviewer: InterviewerEntity): Promise<InterviewerEntity> {
    if (!interviewer.createdBy) {
      throw new BadRequestError('createdBy は必須です');
    }
    try {
      const interviewerData = await this.prisma.interviewer.create({
        data: {
          userId: interviewer.userId,
          category: interviewer.category,
          universityId: interviewer.universityId ?? null,
          facultyId: interviewer.facultyId ?? null,
          createdBy: interviewer.createdBy,
          updatedBy: interviewer.updatedBy,
        },
      });

      return InterviewerMapper.toDomain(interviewerData);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestError(
          'このユーザーは既に面接官として登録されています',
        );
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new NotFoundError('ユーザー', interviewer.userId);
      }
      throw error;
    }
  }

  async findOne({
    userId,
  }: {
    userId: string;
  }): Promise<InterviewerEntity | null> {
    const interviewerData = await this.prisma.interviewer.findUnique({
      where: { userId },
    });

    if (!interviewerData) {
      return null;
    }

    return InterviewerMapper.toDomain(interviewerData);
  }

  async update(interviewer: InterviewerEntity): Promise<InterviewerEntity> {
    try {
      const interviewerData = await this.prisma.interviewer.update({
        where: { userId: interviewer.userId },
        data: {
          category: interviewer.category,
          universityId: interviewer.universityId ?? null,
          facultyId: interviewer.facultyId ?? null,
          updatedBy: interviewer.updatedBy,
        },
      });

      return InterviewerMapper.toDomain(interviewerData);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('面接官', interviewer.userId);
      }
      throw error;
    }
  }

  async delete({ userId }: { userId: string }): Promise<void> {
    try {
      await this.prisma.interviewer.delete({
        where: { userId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('面接官', userId);
      }
      throw error;
    }
  }
}
