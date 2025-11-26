import { Injectable, Inject } from '@nestjs/common';
import type { IEventRepository } from '../../domain/event/event.repository.interface';
import { EventEntity } from '../../domain/event/event.entity';
import { EventResponseDto } from '../../../query/dto/event/event.dto';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';
import { parseISOString } from '../../../common/utils/date.utils';
import { EventMasterDao } from '../../../query/dao/event-master/event-master.dao';
import { EventLocationDao } from '../../../query/dao/event-location/event-location.dao';
import { EventDao } from '../../../query/dao/event/event.dao';

@Injectable()
export class EventBulkService {
  constructor(
    @Inject(INJECTION_TOKENS.IEventRepository)
    private readonly eventRepository: IEventRepository,
    private readonly eventMasterDao: EventMasterDao,
    private readonly eventLocationDao: EventLocationDao,
    private readonly eventDao: EventDao,
  ) {}

  async bulkCreate(params: {
    events: {
      startTime: string;
      endTime: string | null;
      notes: string | null;
      eventMasterId: string;
      locationId: string;
      address: string | null;
      interviewerIds?: string[];
    }[];
    userId: string;
  }): Promise<EventResponseDto[]> {
    // Promise.allSettledを使用して、一部のイベントが失敗しても続行
    const results = await Promise.allSettled(
      params.events.map(async (eventData) => {
        // イベントマスターとロケーションの存在確認
        const eventMaster = await this.eventMasterDao.findOne({
          id: eventData.eventMasterId,
        });
        if (!eventMaster) {
          throw new Error(
            `イベントマスターが見つかりません: ${eventData.eventMasterId}`,
          );
        }

        const location = await this.eventLocationDao.findOne({
          id: eventData.locationId,
        });
        if (!location) {
          throw new Error(
            `ロケーションが見つかりません: ${eventData.locationId}`,
          );
        }

        const eventEntity = EventEntity.create({
          startTime: parseISOString(eventData.startTime),
          endTime: eventData.endTime ? parseISOString(eventData.endTime) : null,
          notes: eventData.notes,
          eventMasterId: eventData.eventMasterId,
          eventMasterName: eventMaster.name,
          locationId: eventData.locationId,
          locationName: location.name,
          address: eventData.address,
          createdBy: params.userId,
          updatedBy: params.userId,
        });

        return this.eventRepository.create(
          eventEntity,
          eventData.interviewerIds || [],
          params.userId,
        );
      }),
    );

    // 成功したイベントのみを取得
    const createdEvents: EventEntity[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        createdEvents.push(result.value);
      }
      // rejectedの場合はスキップ
    }

    if (createdEvents.length === 0) {
      return [];
    }

    // バッチクエリで一括取得してパフォーマンスを改善
    const eventIds = createdEvents
      .map((event) => event.id)
      .filter((id): id is string => id !== undefined);
    const eventsWithRelations = await Promise.all(
      eventIds.map((id) => this.eventDao.findOne({ id })),
    );

    // データ不整合を検知するため、エラーはそのまま伝播させる
    return eventsWithRelations
      .filter((event): event is NonNullable<typeof event> => event !== null)
      .filter((event): event is NonNullable<typeof event> => event !== null);
  }
}
