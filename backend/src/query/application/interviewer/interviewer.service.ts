import { Injectable } from '@nestjs/common';
import { InterviewerDao } from '../../dao/interviewer/interviewer.dao';
import { InterviewerResponseDto } from '../../dto/interviewer/interviewer.dto';
import { InterviewerListResponseDto } from '../../dto/interviewer/interviewer-list-response.dto';
import { splitIds } from '../../../common/utils/string.utils';
import { NotFoundError } from '../../../common/errors/not-found.error';
import type { InterviewerCategory } from '../../types/interviewer.types';

type FindManyParams = {
  userId?: string;
  search?: string;
  category?: InterviewerCategory;
};

@Injectable()
export class InterviewerService {
  constructor(private readonly interviewerDao: InterviewerDao) {}

  async findMany(params: FindManyParams): Promise<InterviewerListResponseDto> {
    const userIds = params.userId ? splitIds(params.userId) : undefined;

    const interviewers = await this.interviewerDao.findAll({
      userIds,
      search: params.search,
      category: params.category,
    });

    return new InterviewerListResponseDto({
      interviewers,
    });
  }

  async findOne({
    userId,
  }: {
    userId: string;
  }): Promise<InterviewerResponseDto> {
    const interviewer = await this.interviewerDao.findOne({ userId });
    if (!interviewer) {
      throw new NotFoundError('面接官', userId);
    }

    return interviewer;
  }
}
