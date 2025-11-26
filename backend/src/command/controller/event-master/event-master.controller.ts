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
import { EventMasterService } from '../../application/event-master/event-master.service';
import type {
  UpdateEventMasterRequestDto,
  CreateEventMasterRequestDto,
  BulkCreateEventMasterRequestDto,
} from '../../dto/event-master/event-master.dto';
import {
  updateEventMasterRequestSchema,
  createEventMasterRequestSchema,
  bulkCreateEventMasterRequestSchema,
} from '../../dto/event-master/event-master.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { EventMasterResponseDto } from '../../../query/dto/event-master/event-master.dto';
import { z } from 'zod';

@ApiTags('event-masters')
@Controller('event-masters')
export class EventMasterController {
  constructor(private readonly eventMasterService: EventMasterService) {}

  @Post()
  @ApiOperation({ summary: 'イベントマスターを作成' })
  @ApiResponse({
    status: 201,
    description: 'イベントマスターが正常に作成されました',
    type: EventMasterResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async create(
    @Body(new ZodValidationPipe(createEventMasterRequestSchema))
    dto: CreateEventMasterRequestDto,
  ): Promise<EventMasterResponseDto> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return this.eventMasterService.create({
      name: dto.name,
      description: dto.description,
      type: dto.type,
      recruitYearId: dto.recruitYearId,
      userId,
    });
  }

  @Put()
  @ApiOperation({ summary: 'イベントマスターを更新' })
  @ApiResponse({
    status: 200,
    description: 'イベントマスターが正常に更新されました',
    type: EventMasterResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({ status: 404, description: 'イベントマスターが見つかりません' })
  async update(
    @Body(new ZodValidationPipe(updateEventMasterRequestSchema))
    dto: UpdateEventMasterRequestDto,
  ): Promise<EventMasterResponseDto> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return this.eventMasterService.update({
      id: dto.id,
      name: dto.name,
      description: dto.description,
      type: dto.type,
      userId,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'イベントマスターを削除' })
  @ApiParam({ name: 'id', description: 'イベントマスターID' })
  @ApiResponse({
    status: 204,
    description: 'イベントマスターが正常に削除されました',
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({ status: 404, description: 'イベントマスターが見つかりません' })
  async delete(
    @Param(
      'id',
      new ZodValidationPipe(z.string().min(1, 'イベントマスターIDは必須です')),
    )
    id: string,
  ): Promise<void> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    await this.eventMasterService.delete({
      id,
      userId,
    });
  }

  @Post('bulk')
  @ApiOperation({ summary: 'イベントマスターを一括作成' })
  @ApiResponse({
    status: 201,
    description: 'イベントマスターが正常に一括作成されました',
    type: [EventMasterResponseDto],
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async bulkCreate(
    @Body(new ZodValidationPipe(bulkCreateEventMasterRequestSchema))
    dto: BulkCreateEventMasterRequestDto,
  ): Promise<EventMasterResponseDto[]> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return await this.eventMasterService.bulkCreate({
      eventMasters: dto.eventMasters,
      userId,
    });
  }
}
