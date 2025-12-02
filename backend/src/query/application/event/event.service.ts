import { Injectable } from '@nestjs/common';
import { EventDao } from '../../dao/event/event.dao';
import { EventResponseDto } from '../../dto/event/event.dto';
import { splitIds } from '../../../common/utils/string.utils';
import { parseISOString } from '../../../common/utils/date.utils';

@Injectable()
export class EventService {
  constructor(private readonly eventDao: EventDao) {}

  async findAll({
    id,
    search,
    eventMasterId,
    locationId,
    interviewerId,
    startTimeFrom,
    recruitYearId,
  }: {
    id?: string;
    search?: string;
    eventMasterId?: string;
    locationId?: string;
    interviewerId?: string;
    startTimeFrom?: string;
    recruitYearId: number;
  }): Promise<EventResponseDto[]> {
    // ID文字列を配列に変換（カンマ/スペース区切り対応）
    const ids = id ? splitIds(id) : undefined;

    // 日時文字列をDateオブジェクトに変換
    const startTimeFromDate = startTimeFrom
      ? parseISOString(startTimeFrom)
      : undefined;

    const events = await this.eventDao.findAll({
      ids,
      search,
      eventMasterId,
      locationId,
      interviewerId,
      startTimeFrom: startTimeFromDate,
      recruitYearId,
    });

    return events;
  }

  async findOne({ id }: { id: string }): Promise<EventResponseDto | null> {
    return this.eventDao.findOne({ id });
  }
}
