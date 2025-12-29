import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { StudentService } from '../../application/student/student.service';
import { StudentResponseDto } from '../../dto/student/student-response.dto';
import {
  studentListQuerySchema,
  type StudentListQueryDto,
} from '../../dto/student/student-list-query.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { FIELD_NAME } from '../../../common/constants';
import { studentIdParamSchema } from '../../../common/dto/id-param.dto';

@ApiTags('students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @ApiOperation({ summary: '生徒一覧を取得' })
  @ApiQuery({ name: 'schoolId', required: true, description: FIELD_NAME.SCHOOL_ID })
  @ApiResponse({
    status: 200,
    description: '生徒一覧を取得しました',
    type: [StudentResponseDto],
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async findAllBySchoolId(
    @Query(new ZodValidationPipe(studentListQuerySchema))
    query: StudentListQueryDto,
  ): Promise<StudentResponseDto[]> {
    return this.studentService.findAllBySchoolId({
      schoolId: query.schoolId,
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
  @ApiResponse({ status: 404, description: '生徒が見つかりません' })
  async findOne(
    @Param('id', new ZodValidationPipe(studentIdParamSchema))
    id: string,
  ): Promise<StudentResponseDto> {
    return this.studentService.findOne({ id });
  }
}

