import {
  Controller,
  Put,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DepartmentService } from '../../application/department/department.service';
import type {
  UpdateDepartmentRequestDto,
  CreateDepartmentRequestDto,
} from '../../dto/department/department.dto';
import {
  updateDepartmentRequestSchema,
  createDepartmentRequestSchema,
} from '../../dto/department/department.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { DepartmentResponseDto } from '../../../query/dto/department/department.dto';
import { z } from 'zod';

@ApiTags('departments')
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @ApiOperation({ summary: '部署を作成' })
  @ApiResponse({
    status: 201,
    description: '部署が正常に作成されました',
    type: DepartmentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async create(
    @Body(new ZodValidationPipe(createDepartmentRequestSchema))
    dto: CreateDepartmentRequestDto,
  ): Promise<DepartmentResponseDto> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return this.departmentService.create({
      name: dto.name,
      userId,
    });
  }

  @Put()
  @ApiOperation({ summary: '部署を更新' })
  @ApiResponse({
    status: 200,
    description: '部署が正常に更新されました',
    type: DepartmentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({ status: 404, description: '部署が見つかりません' })
  async update(
    @Body(new ZodValidationPipe(updateDepartmentRequestSchema))
    dto: UpdateDepartmentRequestDto,
  ): Promise<DepartmentResponseDto> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return this.departmentService.update({
      id: dto.id,
      name: dto.name,
      userId,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '部署を削除' })
  @ApiParam({ name: 'id', description: '部署ID' })
  @ApiResponse({
    status: 204,
    description: '部署が正常に削除されました',
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({ status: 404, description: '部署が見つかりません' })
  async delete(
    @Param('id', new ZodValidationPipe(z.string().min(1, '部署IDは必須です')))
    id: string,
  ): Promise<void> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    await this.departmentService.delete({
      id,
      userId,
    });
  }
}
