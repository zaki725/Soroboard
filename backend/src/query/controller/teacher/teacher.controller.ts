import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { TeacherService } from '../../application/teacher/teacher.service';
import { TeacherResponseDto } from '../../dto/teacher/teacher-response.dto';
import {
  teacherListQuerySchema,
  type TeacherListQueryDto,
} from '../../dto/teacher/teacher-list-query.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { FIELD_NAME } from '../../../common/constants';
import { teacherIdParamSchema } from '../../../common/dto/id-param.dto';

@ApiTags('teachers')
@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  @ApiOperation({ summary: '先生一覧を取得' })
  @ApiQuery({ name: 'schoolId', required: true, description: FIELD_NAME.SCHOOL_ID })
  @ApiResponse({
    status: 200,
    description: '先生一覧を取得しました',
    type: [TeacherResponseDto],
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async findAllBySchoolId(
    @Query(new ZodValidationPipe(teacherListQuerySchema))
    query: TeacherListQueryDto,
  ): Promise<TeacherResponseDto[]> {
    return this.teacherService.findAllBySchoolId({
      schoolId: query.schoolId,
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
  @ApiResponse({ status: 404, description: '先生が見つかりません' })
  async findOne(
    @Param('id', new ZodValidationPipe(teacherIdParamSchema))
    id: string,
  ): Promise<TeacherResponseDto> {
    return this.teacherService.findOne({ id });
  }
}

