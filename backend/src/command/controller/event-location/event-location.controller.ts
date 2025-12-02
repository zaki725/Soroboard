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
import { EventLocationService } from '../../application/event-location/event-location.service';
import type {
  UpdateEventLocationRequestDto,
  CreateEventLocationRequestDto,
  BulkCreateEventLocationRequestDto,
} from '../../dto/event-location/event-location.dto';
import {
  updateEventLocationRequestSchema,
  createEventLocationRequestSchema,
  bulkCreateEventLocationRequestSchema,
} from '../../dto/event-location/event-location.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { EventLocationResponseDto } from '../../../query/dto/event-location/event-location.dto';
import { z } from 'zod';

@ApiTags('event-locations')
@Controller('event-locations')
export class EventLocationCommandController {
  constructor(private readonly eventLocationService: EventLocationService) {}

  @Post()
  @ApiOperation({ summary: 'ロケーションを作成' })
  @ApiResponse({
    status: 201,
    description: 'ロケーションが正常に作成されました',
    type: EventLocationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async create(
    @Body(new ZodValidationPipe(createEventLocationRequestSchema))
    dto: CreateEventLocationRequestDto,
  ): Promise<EventLocationResponseDto> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return this.eventLocationService.create({
      name: dto.name,
      userId,
    });
  }

  @Put()
  @ApiOperation({ summary: 'ロケーションを更新' })
  @ApiResponse({
    status: 200,
    description: 'ロケーションが正常に更新されました',
    type: EventLocationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({ status: 404, description: 'ロケーションが見つかりません' })
  async update(
    @Body(new ZodValidationPipe(updateEventLocationRequestSchema))
    dto: UpdateEventLocationRequestDto,
  ): Promise<EventLocationResponseDto> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return this.eventLocationService.update({
      id: dto.id,
      name: dto.name,
      userId,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'ロケーションを削除' })
  @ApiParam({ name: 'id', description: 'ロケーションID' })
  @ApiResponse({
    status: 204,
    description: 'ロケーションが正常に削除されました',
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({ status: 404, description: 'ロケーションが見つかりません' })
  async delete(
    @Param(
      'id',
      new ZodValidationPipe(z.string().min(1, 'ロケーションIDは必須です')),
    )
    id: string,
  ): Promise<void> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    await this.eventLocationService.delete({
      id,
      userId,
    });
  }

  @Post('bulk')
  @ApiOperation({ summary: 'ロケーションを一括作成' })
  @ApiResponse({
    status: 201,
    description: 'ロケーションが正常に一括作成されました',
    type: [EventLocationResponseDto],
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async bulkCreate(
    @Body(new ZodValidationPipe(bulkCreateEventLocationRequestSchema))
    dto: BulkCreateEventLocationRequestDto,
  ): Promise<EventLocationResponseDto[]> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return await this.eventLocationService.bulkCreate({
      eventLocations: dto.eventLocations,
      userId,
    });
  }
}
