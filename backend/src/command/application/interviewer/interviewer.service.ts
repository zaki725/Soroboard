import { Injectable, Inject } from '@nestjs/common';
import type { IInterviewerRepository } from '../../domain/interviewer/interviewer.repository.interface';
import { InterviewerEntity } from '../../domain/interviewer/interviewer.entity';
import { InterviewerResponseDto } from '../../../query/dto/interviewer/interviewer.dto';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { CREATE, UPDATE, DELETE } from '../../../common/constants';
import { NotFoundError } from '../../../common/errors/not-found.error';
import type { InterviewerCategory } from '../../../query/types/interviewer.types';
import { InterviewerBulkService } from './interviewer-bulk.service';

type CreateParams = {
  userId: string;
  category: InterviewerCategory;
  universityId?: string;
  facultyId?: string;
  userIdForOperation: string;
};

type UpdateParams = {
  userId: string;
  category: InterviewerCategory;
  universityId?: string;
  facultyId?: string;
  userIdForOperation: string;
};

type DeleteParams = {
  userId: string;
  userIdForOperation: string;
};

@Injectable()
export class InterviewerService {
  constructor(
    @Inject(INJECTION_TOKENS.IInterviewerRepository)
    private readonly interviewerRepository: IInterviewerRepository,
    private readonly interviewerBulkService: InterviewerBulkService,
  ) {}

  async create(params: CreateParams): Promise<InterviewerResponseDto> {
    if (!params.userIdForOperation) {
      throw new BadRequestError(CREATE.USER_ID_REQUIRED);
    }

    const interviewerEntity = InterviewerEntity.create({
      userId: params.userId,
      category: params.category,
      universityId: params.universityId,
      facultyId: params.facultyId,
      createdBy: params.userIdForOperation,
      updatedBy: params.userIdForOperation,
    });

    const created = await this.interviewerRepository.create(interviewerEntity);
    return new InterviewerResponseDto({
      userId: created.userId,
      category: created.category,
      universityId: created.universityId,
      facultyId: created.facultyId,
    });
  }

  async update(params: UpdateParams): Promise<InterviewerResponseDto> {
    if (!params.userId) {
      throw new BadRequestError(UPDATE.ID_REQUIRED);
    }

    if (!params.userIdForOperation) {
      throw new BadRequestError(UPDATE.USER_ID_REQUIRED);
    }

    // 既存の面接官情報を取得
    const existingInterviewer = await this.interviewerRepository.findOne({
      userId: params.userId,
    });
    if (!existingInterviewer) {
      throw new NotFoundError('面接官', params.userId);
    }

    const interviewerEntity = InterviewerEntity.create({
      userId: params.userId,
      category: params.category,
      universityId: params.universityId,
      facultyId: params.facultyId,
      updatedBy: params.userIdForOperation,
    });

    const updated = await this.interviewerRepository.update(interviewerEntity);
    return new InterviewerResponseDto({
      userId: updated.userId,
      category: updated.category,
      universityId: updated.universityId,
      facultyId: updated.facultyId,
    });
  }

  async delete(params: DeleteParams): Promise<void> {
    if (!params.userId) {
      throw new BadRequestError(DELETE.ID_REQUIRED);
    }

    if (!params.userIdForOperation) {
      throw new BadRequestError(DELETE.USER_ID_REQUIRED);
    }

    await this.interviewerRepository.delete({ userId: params.userId });
  }

  async bulkCreate(params: {
    interviewers: Array<{
      userId: string;
      category: InterviewerCategory;
      universityId?: string;
      facultyId?: string;
    }>;
    userIdForOperation: string;
  }): Promise<InterviewerResponseDto[]> {
    return this.interviewerBulkService.bulkCreate(params);
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
    return this.interviewerBulkService.bulkUpdate(params);
  }
}
