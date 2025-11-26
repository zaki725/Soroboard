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
import { DeviationValueService } from '../../application/deviation-value/deviation-value.service';
import type {
  UpdateDeviationValueRequestDto,
  CreateDeviationValueRequestDto,
} from '../../dto/deviation-value/deviation-value.dto';
import {
  updateDeviationValueRequestSchema,
  createDeviationValueRequestSchema,
} from '../../dto/deviation-value/deviation-value.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { DeviationValueResponseDto } from '../../../query/dto/faculty/faculty.dto';
import { z } from 'zod';

const deviationValueIdParamSchema = z.string().min(1, '偏差値IDは必須です');

@ApiTags('deviation-values')
@Controller('deviation-values')
export class DeviationValueController {
  constructor(private readonly deviationValueService: DeviationValueService) {}

  @Post()
  @ApiOperation({ summary: '偏差値を作成' })
  @ApiResponse({
    status: 201,
    description: '偏差値が正常に作成されました',
    type: DeviationValueResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async create(
    @Body(new ZodValidationPipe(createDeviationValueRequestSchema))
    dto: CreateDeviationValueRequestDto,
  ): Promise<DeviationValueResponseDto> {
    const userId = 'system';

    return this.deviationValueService.create({
      facultyId: dto.facultyId,
      value: dto.value,
      userId,
    });
  }

  @Put()
  @ApiOperation({ summary: '偏差値を更新' })
  @ApiResponse({
    status: 200,
    description: '偏差値が正常に更新されました',
    type: DeviationValueResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({ status: 404, description: '偏差値が見つかりません' })
  async update(
    @Body(new ZodValidationPipe(updateDeviationValueRequestSchema))
    dto: UpdateDeviationValueRequestDto,
  ): Promise<DeviationValueResponseDto> {
    const userId = 'system';

    return this.deviationValueService.update({
      id: dto.id,
      value: dto.value,
      userId,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '偏差値を削除' })
  @ApiParam({ name: 'id', description: '偏差値ID' })
  @ApiResponse({
    status: 204,
    description: '偏差値が正常に削除されました',
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({ status: 404, description: '偏差値が見つかりません' })
  async delete(
    @Param('id', new ZodValidationPipe(deviationValueIdParamSchema))
    id: string,
  ): Promise<void> {
    const userId = 'system';

    await this.deviationValueService.delete({
      id,
      userId,
    });
  }
}
