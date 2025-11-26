import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { EventLocationService } from '../../application/event-location/event-location.service';
import { EventLocationResponseDto } from '../../dto/event-location/event-location.dto';
import {
  eventLocationListQuerySchema,
  type EventLocationListQueryDto,
} from '../../dto/event-location/event-location-list-query.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';

@ApiTags('event-locations')
@Controller('event-locations')
export class EventLocationQueryController {
  constructor(private readonly eventLocationService: EventLocationService) {}

  @Get()
  @ApiOperation({ summary: 'ロケーション一覧を取得' })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'ID（カンマ/スペース区切り可）',
  })
  @ApiQuery({ name: 'search', required: false, description: '検索キーワード' })
  @ApiResponse({
    status: 200,
    description: 'ロケーション一覧を取得しました',
    type: [EventLocationResponseDto],
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async findAll(
    @Query(new ZodValidationPipe(eventLocationListQuerySchema))
    query: EventLocationListQueryDto,
  ): Promise<EventLocationResponseDto[]> {
    return this.eventLocationService.findAll({
      id: query.id,
      search: query.search,
    });
  }
}
