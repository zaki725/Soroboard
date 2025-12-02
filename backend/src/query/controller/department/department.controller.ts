import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DepartmentService } from '../../application/department/department.service';
import { DepartmentResponseDto } from '../../dto/department/department.dto';
import {
  departmentListQuerySchema,
  type DepartmentListQueryDto,
} from '../../dto/department/department-list-query.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';

@ApiTags('departments')
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  @ApiOperation({ summary: '部署一覧を取得' })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'ID（カンマ/スペース区切り可）',
  })
  @ApiQuery({ name: 'search', required: false, description: '検索キーワード' })
  @ApiResponse({
    status: 200,
    description: '部署一覧を取得しました',
    type: [DepartmentResponseDto],
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async findAll(
    @Query(new ZodValidationPipe(departmentListQuerySchema))
    query: DepartmentListQueryDto,
  ): Promise<DepartmentResponseDto[]> {
    return this.departmentService.findAll({
      id: query.id,
      search: query.search,
    });
  }
}
