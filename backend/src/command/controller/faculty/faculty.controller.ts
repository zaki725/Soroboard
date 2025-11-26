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
import { FacultyService } from '../../application/faculty/faculty.service';
import type {
  UpdateFacultyRequestDto,
  CreateFacultyRequestDto,
  BulkCreateFacultyRequestDto,
} from '../../dto/faculty/faculty.dto';
import {
  updateFacultyRequestSchema,
  createFacultyRequestSchema,
  bulkCreateFacultyRequestSchema,
} from '../../dto/faculty/faculty.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { FacultyResponseDto } from '../../../query/dto/faculty/faculty.dto';
import { z } from 'zod';

const facultyIdParamSchema = z.string().min(1, '学部IDは必須です');
const universityIdParamSchema = z.string().min(1, '大学IDは必須です');

@ApiTags('faculties')
@Controller('faculties')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Post()
  @ApiOperation({ summary: '学部を作成' })
  @ApiResponse({
    status: 201,
    description: '学部が正常に作成されました',
    type: FacultyResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async create(
    @Body(new ZodValidationPipe(createFacultyRequestSchema))
    dto: CreateFacultyRequestDto,
  ): Promise<FacultyResponseDto> {
    const userId = 'system';

    return this.facultyService.create({
      name: dto.name,
      universityId: dto.universityId,
      deviationValue: dto.deviationValue,
      userId,
    });
  }

  @Put()
  @ApiOperation({ summary: '学部を更新' })
  @ApiResponse({
    status: 200,
    description: '学部が正常に更新されました',
    type: FacultyResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({ status: 404, description: '学部が見つかりません' })
  async update(
    @Body(new ZodValidationPipe(updateFacultyRequestSchema))
    dto: UpdateFacultyRequestDto,
  ): Promise<FacultyResponseDto> {
    const userId = 'system';

    return this.facultyService.update({
      id: dto.id,
      name: dto.name,
      deviationValue: dto.deviationValue,
      userId,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '学部を削除' })
  @ApiParam({ name: 'id', description: '学部ID' })
  @ApiResponse({
    status: 204,
    description: '学部が正常に削除されました',
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({ status: 404, description: '学部が見つかりません' })
  async delete(
    @Param('id', new ZodValidationPipe(facultyIdParamSchema)) id: string,
  ): Promise<void> {
    const userId = 'system';

    await this.facultyService.delete({
      id,
      userId,
    });
  }

  @Post('universities/:universityId/bulk')
  @ApiOperation({ summary: '学部・偏差値を一括登録' })
  @ApiParam({ name: 'universityId', description: '大学ID' })
  @ApiResponse({
    status: 201,
    description: '学部・偏差値が正常に登録されました',
    type: [FacultyResponseDto],
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async bulkCreate(
    @Param('universityId', new ZodValidationPipe(universityIdParamSchema))
    universityId: string,
    @Body(new ZodValidationPipe(bulkCreateFacultyRequestSchema))
    dto: BulkCreateFacultyRequestDto,
  ): Promise<FacultyResponseDto[]> {
    const userId = 'system';

    return this.facultyService.bulkCreate({
      universityId,
      faculties: dto.faculties,
      userId,
    });
  }
}
