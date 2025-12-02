import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EducationalBackgroundService } from '../../application/educational-background/educational-background.service';
import type {
  CreateEducationalBackgroundRequestDto,
  UpdateEducationalBackgroundRequestDto,
} from '../../dto/educational-background/educational-background.dto';
import {
  createEducationalBackgroundRequestSchema,
  updateEducationalBackgroundRequestSchema,
} from '../../dto/educational-background/educational-background.dto';
import { EducationalBackgroundResponseDto } from '../../../query/dto/educational-background/educational-background.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { z } from 'zod';

const educationalBackgroundIdParamSchema = z
  .string()
  .min(1, '学歴IDは必須です');
const interviewerIdParamSchema = z.string().min(1, '面接官IDは必須です');

@ApiTags('educational-backgrounds')
@Controller('educational-backgrounds')
export class EducationalBackgroundController {
  constructor(
    private readonly educationalBackgroundService: EducationalBackgroundService,
  ) {}

  @Post()
  @ApiOperation({ summary: '学歴を作成' })
  @ApiResponse({
    status: 201,
    description: '学歴が正常に作成されました',
    type: EducationalBackgroundResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async create(
    @Body(new ZodValidationPipe(createEducationalBackgroundRequestSchema))
    dto: CreateEducationalBackgroundRequestDto,
  ): Promise<EducationalBackgroundResponseDto> {
    const userId = 'system';

    return this.educationalBackgroundService.create({
      interviewerId: dto.interviewerId,
      educationType: dto.educationType,
      universityId: dto.universityId,
      facultyId: dto.facultyId,
      graduationYear: dto.graduationYear,
      graduationMonth: dto.graduationMonth,
      userId,
    });
  }

  @Put()
  @ApiOperation({ summary: '学歴を更新' })
  @ApiResponse({
    status: 200,
    description: '学歴が正常に更新されました',
    type: EducationalBackgroundResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({ status: 404, description: '学歴が見つかりません' })
  async update(
    @Body(new ZodValidationPipe(updateEducationalBackgroundRequestSchema))
    dto: UpdateEducationalBackgroundRequestDto,
  ): Promise<EducationalBackgroundResponseDto> {
    const userId = 'system';

    return this.educationalBackgroundService.update({
      id: dto.id,
      educationType: dto.educationType,
      universityId: dto.universityId,
      facultyId: dto.facultyId,
      graduationYear: dto.graduationYear,
      graduationMonth: dto.graduationMonth,
      userId,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '学歴を削除' })
  @ApiParam({ name: 'id', description: '学歴ID' })
  @ApiResponse({
    status: 204,
    description: '学歴が正常に削除されました',
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({ status: 404, description: '学歴が見つかりません' })
  async delete(
    @Param('id', new ZodValidationPipe(educationalBackgroundIdParamSchema))
    id: string,
  ): Promise<void> {
    const userId = 'system';

    await this.educationalBackgroundService.delete({
      id,
      userId,
    });
  }

  @Get('interviewers/:interviewerId')
  @ApiOperation({ summary: '面接官の学歴一覧を取得' })
  @ApiParam({ name: 'interviewerId', description: '面接官ID（ユーザーID）' })
  @ApiResponse({
    status: 200,
    description: '学歴一覧を取得しました',
    type: [EducationalBackgroundResponseDto],
  })
  async findAllByInterviewerId(
    @Param('interviewerId', new ZodValidationPipe(interviewerIdParamSchema))
    interviewerId: string,
  ): Promise<EducationalBackgroundResponseDto[]> {
    return this.educationalBackgroundService.findAllByInterviewerId({
      interviewerId,
    });
  }
}
