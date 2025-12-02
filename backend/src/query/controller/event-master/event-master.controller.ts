import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { EventMasterService } from '../../application/event-master/event-master.service';
import { EventMasterResponseDto } from '../../dto/event-master/event-master.dto';
import {
  eventMasterListQuerySchema,
  type EventMasterListQueryDto,
} from '../../dto/event-master/event-master-list-query.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';

@ApiTags('event-masters')
@Controller('event-masters')
export class EventMasterController {
  constructor(private readonly eventMasterService: EventMasterService) {}

  @Get()
  @ApiOperation({ summary: 'イベントマスター一覧を取得' })
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
    name: 'type',
    required: false,
    description: 'ロケーションタイプ（オンライン/対面/オンライン_対面）',
  })
  @ApiResponse({
    status: 200,
    description: 'イベントマスター一覧を取得しました',
    type: [EventMasterResponseDto],
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async findAll(
    @Query(new ZodValidationPipe(eventMasterListQuerySchema))
    query: EventMasterListQueryDto,
  ): Promise<EventMasterResponseDto[]> {
    return this.eventMasterService.findAll({
      id: query.id,
      search: query.search,
      recruitYearId: query.recruitYearId,
      type: query.type,
    });
  }
}
