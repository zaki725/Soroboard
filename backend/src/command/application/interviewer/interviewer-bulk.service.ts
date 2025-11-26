import { Injectable, Inject } from '@nestjs/common';
import type { IInterviewerRepository } from '../../domain/interviewer/interviewer.repository.interface';
import { InterviewerEntity } from '../../domain/interviewer/interviewer.entity';
import { InterviewerResponseDto } from '../../../query/dto/interviewer/interviewer.dto';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { CREATE, UPDATE } from '../../../common/constants';
import { MIN_LENGTH } from '../../../common/constants';
import type { InterviewerCategory } from '../../../query/types/interviewer.types';
import { PrismaService } from '../../../prisma.service';
import { NotFoundError } from '../../../common/errors/not-found.error';

@Injectable()
export class InterviewerBulkService {
  constructor(
    @Inject(INJECTION_TOKENS.IInterviewerRepository)
    private readonly interviewerRepository: IInterviewerRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async bulkCreate(params: {
    interviewers: Array<{
      userId: string;
      category: InterviewerCategory;
      universityId?: string;
      facultyId?: string;
    }>;
    userIdForOperation: string;
  }): Promise<InterviewerResponseDto[]> {
    if (!params.userIdForOperation) {
      throw new BadRequestError(CREATE.USER_ID_REQUIRED);
    }

    if (!params.interviewers || params.interviewers.length === 0) {
      throw new BadRequestError(MIN_LENGTH.INTERVIEWERS);
    }

    return await this.prismaService.$transaction(async () => {
      const createdInterviewers: InterviewerResponseDto[] = [];

      for (const interviewerData of params.interviewers) {
        const interviewerEntity = InterviewerEntity.create({
          userId: interviewerData.userId,
          category: interviewerData.category,
          universityId: interviewerData.universityId,
          facultyId: interviewerData.facultyId,
          createdBy: params.userIdForOperation,
          updatedBy: params.userIdForOperation,
        });

        const created =
          await this.interviewerRepository.create(interviewerEntity);

        createdInterviewers.push(
          new InterviewerResponseDto({
            userId: created.userId,
            category: created.category,
            universityId: created.universityId,
            facultyId: created.facultyId,
          }),
        );
      }

      return createdInterviewers;
    });
  }

  async bulkUpdate(params: {
    interviewers: Array<{
      userId: string;
      category: InterviewerCategory;
      universityId?: string;
      facultyId?: string;
    }>;
    userIdForOperation: string;
  }): Promise<InterviewerResponseDto[]> {
    if (!params.userIdForOperation) {
      throw new BadRequestError(UPDATE.USER_ID_REQUIRED);
    }

    if (!params.interviewers || params.interviewers.length === 0) {
      throw new BadRequestError(MIN_LENGTH.INTERVIEWERS);
    }

    return await this.prismaService.$transaction(async () => {
      const updatedInterviewers: InterviewerResponseDto[] = [];

      for (const interviewerData of params.interviewers) {
        // 既存の面接官情報を取得
        const existingInterviewer = await this.interviewerRepository.findOne({
          userId: interviewerData.userId,
        });
        if (!existingInterviewer) {
          throw new NotFoundError('面接官', interviewerData.userId);
        }

        const interviewerEntity = InterviewerEntity.create({
          userId: interviewerData.userId,
          category: interviewerData.category,
          universityId: interviewerData.universityId,
          facultyId: interviewerData.facultyId,
          updatedBy: params.userIdForOperation,
        });

        const updated =
          await this.interviewerRepository.update(interviewerEntity);
        updatedInterviewers.push(
          new InterviewerResponseDto({
            userId: updated.userId,
            category: updated.category,
            universityId: updated.universityId,
            facultyId: updated.facultyId,
          }),
        );
      }

      return updatedInterviewers;
    });
  }
}
