import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { InterviewerService } from '../../application/interviewer/interviewer.service';
import type {
  CreateInterviewerRequestDto,
  UpdateInterviewerRequestDto,
  BulkCreateInterviewerRequestDto,
  BulkUpdateInterviewerRequestDto,
} from '../../dto/interviewer/interviewer.dto';
import {
  createInterviewerRequestSchema,
  updateInterviewerRequestSchema,
  bulkCreateInterviewerRequestSchema,
  bulkUpdateInterviewerRequestSchema,
} from '../../dto/interviewer/interviewer.dto';
import { InterviewerResponseDto } from '../../../query/dto/interviewer/interviewer.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { z } from 'zod';

@ApiTags('interviewers')
@Controller('interviewers')
export class InterviewerController {
  constructor(private readonly interviewerService: InterviewerService) {}

  @Post()
  @ApiOperation({ summary: '面接官を登録' })
  @ApiResponse({
    status: 201,
    description: '面接官が正常に登録されました',
    type: InterviewerResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({
    status: 404,
    description: 'ユーザーが見つかりません',
  })
  async create(
    @Body(new ZodValidationPipe(createInterviewerRequestSchema))
    dto: CreateInterviewerRequestDto,
  ): Promise<InterviewerResponseDto> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return this.interviewerService.create({
      userId: dto.userId,
      category: dto.category,
      userIdForOperation: userId,
    });
  }

  @Put()
  @ApiOperation({ summary: '面接官を更新' })
  @ApiResponse({
    status: 200,
    description: '面接官が正常に更新されました',
    type: InterviewerResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({ status: 404, description: '面接官が見つかりません' })
  async update(
    @Body(new ZodValidationPipe(updateInterviewerRequestSchema))
    dto: UpdateInterviewerRequestDto,
  ): Promise<InterviewerResponseDto> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return this.interviewerService.update({
      userId: dto.userId,
      category: dto.category,
      userIdForOperation: userId,
    });
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '面接官を削除' })
  @ApiParam({ name: 'userId', description: 'ユーザーID（主キー）' })
  @ApiResponse({
    status: 204,
    description: '面接官が正常に削除されました',
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({ status: 404, description: '面接官が見つかりません' })
  async delete(
    @Param(
      'userId',
      new ZodValidationPipe(z.string().min(1, 'ユーザーIDは必須です')),
    )
    userId: string,
  ): Promise<void> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const systemUserId = 'system';

    await this.interviewerService.delete({
      userId,
      userIdForOperation: systemUserId,
    });
  }

  @Post('bulk')
  @ApiOperation({ summary: '面接官を一括登録' })
  @ApiResponse({
    status: 201,
    description: '面接官が正常に一括登録されました',
    type: [InterviewerResponseDto],
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async bulkCreate(
    @Body(new ZodValidationPipe(bulkCreateInterviewerRequestSchema))
    dto: BulkCreateInterviewerRequestDto,
  ): Promise<InterviewerResponseDto[]> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return this.interviewerService.bulkCreate({
      interviewers: dto.interviewers,
      userIdForOperation: userId,
    });
  }

  @Put('bulk')
  @ApiOperation({ summary: '面接官を一括更新' })
  @ApiResponse({
    status: 200,
    description: '面接官が正常に一括更新されました',
    type: [InterviewerResponseDto],
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({ status: 404, description: '面接官が見つかりません' })
  async bulkUpdate(
    @Body(new ZodValidationPipe(bulkUpdateInterviewerRequestSchema))
    dto: BulkUpdateInterviewerRequestDto,
  ): Promise<InterviewerResponseDto[]> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return this.interviewerService.bulkUpdate({
      interviewers: dto.interviewers,
      userIdForOperation: userId,
    });
  }
}
