import { Injectable } from '@nestjs/common';
import { EventLocationDao } from '../../dao/event-location/event-location.dao';
import { EventLocationResponseDto } from '../../dto/event-location/event-location.dto';
import { splitIds } from '../../../common/utils/string.utils';

@Injectable()
export class EventLocationService {
  constructor(private readonly eventLocationDao: EventLocationDao) {}

  async findAll({
    id,
    search,
  }: {
    id?: string;
    search?: string;
  }): Promise<EventLocationResponseDto[]> {
    // ID文字列を配列に変換（カンマ/スペース区切り対応）
    const ids = id ? splitIds(id) : undefined;

    const eventLocations = await this.eventLocationDao.findAll({
      ids,
      search,
    });

    return eventLocations;
  }
}
