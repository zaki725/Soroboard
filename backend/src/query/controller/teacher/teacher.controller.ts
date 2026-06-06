import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import type { Request } from 'express';
import { TeacherService } from '../../application/teacher/teacher.service';
import { TeacherResponseDto } from '../../dto/teacher/teacher-response.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { AUTHENTICATION_REQUIRED, FIELD_NAME } from '../../../common/constants';
import { teacherIdParamSchema } from '../../../common/dto/id-param.dto';
import { UnauthorizedError } from '../../../common/errors/unauthorized.error';

type RequestWithSession = Request & {
  session?: {
    user?: {
      schoolId?: string;
    };
  };
};

@ApiTags('teachers')
@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  @ApiOperation({ summary: '先生一覧を取得' })
  @ApiResponse({
    status: 200,
    description: '先生一覧を取得しました',
    type: [TeacherResponseDto],
  })
  @ApiResponse({ status: 401, description: '認証が必要です' })
  async findAllBySchoolId(
    @Req() req: RequestWithSession,
  ): Promise<TeacherResponseDto[]> {
    const schoolId = this.getSessionSchoolId(req);

    return this.teacherService.findAllBySchoolId({
      schoolId,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: '先生詳細を取得' })
  @ApiParam({ name: 'id', description: FIELD_NAME.TEACHER_ID })
  @ApiResponse({
    status: 200,
    description: '先生詳細を取得しました',
    type: TeacherResponseDto,
  })
  @ApiResponse({ status: 401, description: '認証が必要です' })
  @ApiResponse({ status: 404, description: '先生が見つかりません' })
  async findOne(
    @Req() req: RequestWithSession,
    @Param('id', new ZodValidationPipe(teacherIdParamSchema))
    id: string,
  ): Promise<TeacherResponseDto> {
    const schoolId = this.getSessionSchoolId(req);

    return this.teacherService.findOne({ id, schoolId });
  }

  private getSessionSchoolId(req: RequestWithSession): string {
    const schoolId = req.session?.user?.schoolId;
    if (!schoolId) {
      throw new UnauthorizedError(AUTHENTICATION_REQUIRED);
    }

    return schoolId;
  }
}
