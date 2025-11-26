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
import { UniversityService } from '../../application/university/university.service';
import type {
  UpdateUniversityRequestDto,
  CreateUniversityRequestDto,
  BulkCreateUniversityRequestDto,
} from '../../dto/university/university.dto';
import {
  updateUniversityRequestSchema,
  createUniversityRequestSchema,
  bulkCreateUniversityRequestSchema,
} from '../../dto/university/university.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { UniversityResponseDto } from '../../../query/dto/university/university.dto';
import { z } from 'zod';

@ApiTags('universities')
@Controller('universities')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Post()
  @ApiOperation({ summary: '大学を作成' })
  @ApiResponse({
    status: 201,
    description: '大学が正常に作成されました',
    type: UniversityResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async create(
    @Body(new ZodValidationPipe(createUniversityRequestSchema))
    dto: CreateUniversityRequestDto,
  ): Promise<UniversityResponseDto> {
    const userId = 'system';

    return this.universityService.create({
      name: dto.name,
      rank: dto.rank,
      userId,
    });
  }

  @Put()
  @ApiOperation({ summary: '大学を更新' })
  @ApiResponse({
    status: 200,
    description: '大学が正常に更新されました',
    type: UniversityResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({ status: 404, description: '大学が見つかりません' })
  async update(
    @Body(new ZodValidationPipe(updateUniversityRequestSchema))
    dto: UpdateUniversityRequestDto,
  ): Promise<UniversityResponseDto> {
    const userId = 'system';

    return this.universityService.update({
      id: dto.id,
      name: dto.name,
      rank: dto.rank,
      userId,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '大学を削除' })
  @ApiParam({ name: 'id', description: '大学ID' })
  @ApiResponse({
    status: 204,
    description: '大学が正常に削除されました',
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({ status: 404, description: '大学が見つかりません' })
  async delete(
    @Param('id', new ZodValidationPipe(z.string().min(1, '大学IDは必須です')))
    id: string,
  ): Promise<void> {
    const userId = 'system';

    await this.universityService.delete({
      id,
      userId,
    });
  }

  @Post('bulk')
  @ApiOperation({ summary: '大学・学部・偏差値を一括登録' })
  @ApiResponse({
    status: 201,
    description: '大学・学部・偏差値が正常に登録されました',
    type: UniversityResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async bulkCreate(
    @Body(new ZodValidationPipe(bulkCreateUniversityRequestSchema))
    dto: BulkCreateUniversityRequestDto,
  ): Promise<UniversityResponseDto> {
    const userId = 'system';

    return this.universityService.bulkCreate({
      name: dto.name,
      rank: dto.rank,
      faculties: dto.faculties,
      userId,
    });
  }
}
