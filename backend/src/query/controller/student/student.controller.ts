import { Controller, Get, Param, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import type { Request } from 'express';
import { StudentService } from '../../application/student/student.service';
import { StudentResponseDto } from '../../dto/student/student-response.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { AUTHENTICATION_REQUIRED, FIELD_NAME } from '../../../common/constants';
import { studentIdParamSchema } from '../../../common/dto/id-param.dto';
import { UnauthorizedError } from '../../../common/errors/unauthorized.error';
import { studentListQuerySchema } from '../../dto/student/student-list-query.dto';
import type { StudentListQueryDto } from '../../dto/student/student-list-query.dto';
import { StudentSearchService } from '../../application/student/student-search.service';

type RequestWithSession = Request & {
  session?: {
    user?: {
      schoolId?: string;
    };
  };
};

@ApiTags('students')
@Controller('students')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly studentSearchService: StudentSearchService,
  ) {}

  @Get()
  @ApiOperation({ summary: '生徒一覧を取得' })
  @ApiResponse({
    status: 200,
    description: '生徒一覧を取得しました',
    type: [StudentResponseDto],
  })
  @ApiResponse({ status: 401, description: '認証が必要です' })
  async findAllBySchoolId(
    @Req() req: RequestWithSession,
  ): Promise<StudentResponseDto[]> {
    const schoolId = this.getSessionSchoolId(req);

    return this.studentService.findAllBySchoolId({
      schoolId,
    });
  }

  @Get('search')
  @ApiOperation({ summary: '生徒を検索' })
  @ApiResponse({
    status: 200,
    description: '生徒検索結果を取得しました',
    type: [StudentResponseDto],
  })
  @ApiResponse({ status: 401, description: '認証が必要です' })
  async search(
    @Req() req: RequestWithSession,
    @Query(new ZodValidationPipe(studentListQuerySchema))
    query: StudentListQueryDto
  ): Promise<StudentResponseDto[]> {
    const schoolId = this.getSessionSchoolId(req);

    return this.studentSearchService.search({
      schoolId,
      search: query.search,
      status: query.status,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: '生徒詳細を取得' })
  @ApiParam({ name: 'id', description: FIELD_NAME.STUDENT_ID })
  @ApiResponse({
    status: 200,
    description: '生徒詳細を取得しました',
    type: StudentResponseDto,
  })
  @ApiResponse({ status: 401, description: '認証が必要です' })
  @ApiResponse({ status: 404, description: '生徒が見つかりません' })
  async findOne(
    @Req() req: RequestWithSession,
    @Param('id', new ZodValidationPipe(studentIdParamSchema))
    id: string,
  ): Promise<StudentResponseDto> {
    const schoolId = this.getSessionSchoolId(req);

    return this.studentService.findOne({ id, schoolId });
  }

  private getSessionSchoolId(req: RequestWithSession): string {
    const schoolId = req.session?.user?.schoolId;
    if (!schoolId) {
      throw new UnauthorizedError(AUTHENTICATION_REQUIRED);
    }

    return schoolId;
  }
}
