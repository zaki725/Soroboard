import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { InterviewerEntity } from '../../domain/interviewer/interviewer.entity';
import { InterviewerMapper } from '../../domain/interviewer/interviewer.mapper';
import { IInterviewerRepository } from '../../domain/interviewer/interviewer.repository.interface';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { handlePrismaError } from '../../../common/utils/prisma-error-handler';
import { CustomLoggerService } from '../../../config/custom-logger.service';

@Injectable()
export class InterviewerRepository implements IInterviewerRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

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
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'InterviewerRepository',
      );
      handlePrismaError(error, {
        resourceName: '面接官',
        id: interviewer.userId,
        duplicateMessage: 'このユーザーは既に面接官として登録されています',
        foreignKeyHandler: () => {
          throw new NotFoundError('ユーザー', interviewer.userId);
        },
      });
      throw error; // 到達不能コード（型チェック用）
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
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'InterviewerRepository',
      );
      handlePrismaError(error, {
        resourceName: '面接官',
        id: interviewer.userId,
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async delete({ userId }: { userId: string }): Promise<void> {
    try {
      await this.prisma.interviewer.delete({
        where: { userId },
      });
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'InterviewerRepository',
      );
      handlePrismaError(error, {
        resourceName: '面接官',
        id: userId,
      });
    }
  }
}
