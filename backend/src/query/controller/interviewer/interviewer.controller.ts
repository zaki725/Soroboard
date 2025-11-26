import { Controller, Get, Query, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { InterviewerService } from '../../application/interviewer/interviewer.service';
import { InterviewerListResponseDto } from '../../dto/interviewer/interviewer-list-response.dto';
import { InterviewerResponseDto } from '../../dto/interviewer/interviewer.dto';
import {
  interviewerListQuerySchema,
  type InterviewerListQueryDto,
} from '../../dto/interviewer/interviewer-list-query.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { INTERVIEWER_CATEGORIES } from '../../../common/enums';
import { z } from 'zod';

@ApiTags('interviewers')
@Controller('interviewers')
export class InterviewerController {
  constructor(private readonly interviewerService: InterviewerService) {}

  @Get()
  @ApiOperation({ summary: '面接官一覧を取得' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'ユーザーID（カンマ/スペース区切り可）',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: '検索キーワード（ユーザーID、名前、メールアドレス）',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'カテゴリ（フロントまたは現場社員）',
    enum: INTERVIEWER_CATEGORIES,
  })
  @ApiResponse({
    status: 200,
    description: '面接官一覧を正常に取得しました',
    type: InterviewerListResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async findMany(
    @Query(new ZodValidationPipe(interviewerListQuerySchema))
    query: InterviewerListQueryDto,
  ): Promise<InterviewerListResponseDto> {
    return this.interviewerService.findMany({
      userId: typeof query.userId === 'string' ? query.userId : undefined,
      search: typeof query.search === 'string' ? query.search : undefined,
      category: query.category,
    });
  }

  @Get(':userId')
  @ApiOperation({ summary: '面接官詳細を取得' })
  @ApiParam({ name: 'userId', description: 'ユーザーID（主キー）' })
  @ApiResponse({
    status: 200,
    description: '面接官詳細を正常に取得しました',
    type: InterviewerResponseDto,
  })
  @ApiResponse({ status: 404, description: '面接官が見つかりません' })
  async findOne(
    @Param(
      'userId',
      new ZodValidationPipe(z.string().min(1, 'ユーザーIDは必須です')),
    )
    userId: string,
  ): Promise<InterviewerResponseDto> {
    return this.interviewerService.findOne({ userId });
  }
}
