import { Injectable } from '@nestjs/common';
import { EventMasterDao } from '../../dao/event-master/event-master.dao';
import { EventMasterResponseDto } from '../../dto/event-master/event-master.dto';
import { splitIds } from '../../../common/utils/string.utils';

@Injectable()
export class EventMasterService {
  constructor(private readonly eventMasterDao: EventMasterDao) {}

  async findAll({
    id,
    search,
    recruitYearId,
    type,
  }: {
    id?: string;
    search?: string;
    recruitYearId: number;
    type?: string;
  }): Promise<EventMasterResponseDto[]> {
    // ID文字列を配列に変換（カンマ/スペース区切り対応）
    const ids = id ? splitIds(id) : undefined;

    const eventMasters = await this.eventMasterDao.findAll({
      ids,
      search,
      recruitYearId,
      type,
    });

    return eventMasters;
  }
}
