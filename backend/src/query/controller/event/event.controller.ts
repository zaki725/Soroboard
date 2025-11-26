import { Controller, Get, Query, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { EventService } from '../../application/event/event.service';
import { EventResponseDto } from '../../dto/event/event.dto';
import {
  eventListQuerySchema,
  type EventListQueryDto,
} from '../../dto/event/event-list-query.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { z } from 'zod';

@ApiTags('events')
@Controller('events')
export class EventQueryController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @ApiOperation({ summary: 'イベント一覧を取得' })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'ID（カンマ/スペース区切り可）',
  })
  @ApiQuery({ name: 'search', required: false, description: '検索キーワード' })
  @ApiQuery({
    name: 'recruitYearId',
    required: true,
    description: '年度ID',
  })
  @ApiQuery({
    name: 'eventMasterId',
    required: false,
    description: 'イベントマスターID',
  })
  @ApiQuery({
    name: 'locationId',
    required: false,
    description: 'ロケーションID',
  })
  @ApiQuery({
    name: 'interviewerId',
    required: false,
    description: '面接官ID',
  })
  @ApiQuery({
    name: 'startTimeFrom',
    required: false,
    description: '開始時刻（ISO形式）',
  })
  @ApiResponse({
    status: 200,
    description: 'イベント一覧を取得しました',
    type: [EventResponseDto],
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async findAll(
    @Query(new ZodValidationPipe(eventListQuerySchema))
    query: EventListQueryDto,
  ): Promise<EventResponseDto[]> {
    return this.eventService.findAll({
      id: query.id,
      search: query.search,
      eventMasterId: query.eventMasterId,
      locationId: query.locationId,
      interviewerId: query.interviewerId,
      startTimeFrom: query.startTimeFrom,
      recruitYearId: query.recruitYearId,
    });
  }

  @Get('export')
  @ApiOperation({ summary: 'イベント一覧をCSV出力用に取得' })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'ID（カンマ/スペース区切り可）',
  })
  @ApiQuery({ name: 'search', required: false, description: '検索キーワード' })
  @ApiQuery({
    name: 'recruitYearId',
    required: true,
    description: '年度ID',
  })
  @ApiQuery({
    name: 'eventMasterId',
    required: false,
    description: 'イベントマスターID',
  })
  @ApiQuery({
    name: 'locationId',
    required: false,
    description: 'ロケーションID',
  })
  @ApiQuery({
    name: 'interviewerId',
    required: false,
    description: '面接官ID',
  })
  @ApiQuery({
    name: 'startTimeFrom',
    required: false,
    description: '開始時刻（ISO形式）',
  })
  @ApiResponse({
    status: 200,
    description: 'イベント一覧を取得しました',
    type: [EventResponseDto],
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async export(
    @Query(new ZodValidationPipe(eventListQuerySchema))
    query: EventListQueryDto,
  ): Promise<EventResponseDto[]> {
    return this.eventService.findAll({
      id: query.id,
      search: query.search,
      eventMasterId: query.eventMasterId,
      locationId: query.locationId,
      interviewerId: query.interviewerId,
      startTimeFrom: query.startTimeFrom,
      recruitYearId: query.recruitYearId,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'イベント詳細を取得' })
  @ApiParam({ name: 'id', description: 'イベントID' })
  @ApiResponse({
    status: 200,
    description: 'イベント詳細を取得しました',
    type: EventResponseDto,
  })
  @ApiResponse({ status: 404, description: 'イベントが見つかりません' })
  async findOne(
    @Param(
      'id',
      new ZodValidationPipe(z.string().min(1, 'イベントIDは必須です')),
    )
    id: string,
  ): Promise<EventResponseDto | null> {
    return this.eventService.findOne({ id });
  }
}
