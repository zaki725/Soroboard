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
import { EventService } from '../../application/event/event.service';
import type {
  UpdateEventRequestDto,
  CreateEventRequestDto,
} from '../../dto/event/event.dto';
import {
  updateEventRequestSchema,
  createEventRequestSchema,
} from '../../dto/event/event.dto';
import type { BulkCreateEventRequestDto } from '../../dto/event/event-bulk.dto';
import { bulkCreateEventRequestSchema } from '../../dto/event/event-bulk.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { EventResponseDto } from '../../../query/dto/event/event.dto';
import { z } from 'zod';

@ApiTags('events')
@Controller('events')
export class EventCommandController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({ summary: 'イベントを作成' })
  @ApiResponse({
    status: 201,
    description: 'イベントが正常に作成されました',
    type: EventResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async create(
    @Body(new ZodValidationPipe(createEventRequestSchema))
    dto: CreateEventRequestDto,
  ): Promise<EventResponseDto> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return this.eventService.create({
      startTime: dto.startTime,
      endTime: dto.endTime,
      notes: dto.notes,
      eventMasterId: dto.eventMasterId,
      locationId: dto.locationId,
      address: dto.address,
      interviewerIds: dto.interviewerIds,
      userId,
    });
  }

  @Put()
  @ApiOperation({ summary: 'イベントを更新' })
  @ApiResponse({
    status: 200,
    description: 'イベントが正常に更新されました',
    type: EventResponseDto,
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({ status: 404, description: 'イベントが見つかりません' })
  async update(
    @Body(new ZodValidationPipe(updateEventRequestSchema))
    dto: UpdateEventRequestDto,
  ): Promise<EventResponseDto> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return this.eventService.update({
      id: dto.id,
      startTime: dto.startTime,
      endTime: dto.endTime,
      notes: dto.notes,
      locationId: dto.locationId,
      address: dto.address,
      interviewerIds: dto.interviewerIds,
      userId,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'イベントを削除' })
  @ApiParam({ name: 'id', description: 'イベントID' })
  @ApiResponse({
    status: 204,
    description: 'イベントが正常に削除されました',
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  @ApiResponse({ status: 404, description: 'イベントが見つかりません' })
  async delete(
    @Param(
      'id',
      new ZodValidationPipe(z.string().min(1, 'イベントIDは必須です')),
    )
    id: string,
  ): Promise<void> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    await this.eventService.delete({
      id,
      userId,
    });
  }

  @Post('bulk')
  @ApiOperation({ summary: 'イベントを一括作成' })
  @ApiResponse({
    status: 201,
    description: 'イベントが正常に一括作成されました',
    type: [EventResponseDto],
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async bulkCreate(
    @Body(new ZodValidationPipe(bulkCreateEventRequestSchema))
    dto: BulkCreateEventRequestDto,
  ): Promise<EventResponseDto[]> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return this.eventService.bulkCreate({
      events: dto.events,
      userId,
    });
  }
}
