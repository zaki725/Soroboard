import { Injectable, Inject } from '@nestjs/common';
import type { IEventRepository } from '../../domain/event/event.repository.interface';
import { EventEntity } from '../../domain/event/event.entity';
import { EventResponseDto } from '../../../query/dto/event/event.dto';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { CREATE, UPDATE, DELETE } from '../../../common/constants';
import { parseISOString } from '../../../common/utils/date.utils';
import { EventMasterDao } from '../../../query/dao/event-master/event-master.dao';
import { EventLocationDao } from '../../../query/dao/event-location/event-location.dao';
import { EventBulkService } from './event-bulk.service';

type CreateParams = {
  startTime: string;
  endTime?: string | null;
  notes?: string | null;
  eventMasterId: string;
  locationId: string;
  address?: string | null;
  interviewerIds?: string[];
  userId: string;
};

type UpdateParams = {
  id: string;
  startTime: string;
  endTime?: string | null;
  notes?: string | null;
  locationId: string;
  address?: string | null;
  interviewerIds?: string[];
  userId: string;
};

type DeleteParams = {
  id: string;
  userId: string;
};

@Injectable()
export class EventService {
  constructor(
    @Inject(INJECTION_TOKENS.IEventRepository)
    private readonly eventRepository: IEventRepository,
    private readonly eventMasterDao: EventMasterDao,
    private readonly eventLocationDao: EventLocationDao,
    private readonly eventBulkService: EventBulkService,
  ) {}

  async create(params: CreateParams): Promise<EventResponseDto> {
    if (!params.userId) {
      throw new BadRequestError(CREATE.USER_ID_REQUIRED);
    }

    // イベントマスターとロケーションの存在確認
    const eventMaster = await this.eventMasterDao.findOne({
      id: params.eventMasterId,
    });
    if (!eventMaster) {
      throw new NotFoundError('イベントマスター', params.eventMasterId);
    }

    const location = await this.eventLocationDao.findOne({
      id: params.locationId,
    });
    if (!location) {
      throw new NotFoundError('ロケーション', params.locationId);
    }

    const eventEntity = EventEntity.create({
      startTime: parseISOString(params.startTime),
      endTime: params.endTime ? parseISOString(params.endTime) : null,
      notes: params.notes,
      eventMasterId: params.eventMasterId,
      eventMasterName: eventMaster.name,
      locationId: params.locationId,
      locationName: location.name,
      address: params.address,
      createdBy: params.userId,
      updatedBy: params.userId,
    });

    const created = await this.eventRepository.create(
      eventEntity,
      params.interviewerIds || [],
      params.userId,
    );
    const createdWithId: EventEntity & { id: string } =
      created as EventEntity & { id: string };

    createdWithId.ensureId();

    return new EventResponseDto({
      id: createdWithId.id,
      startTime: createdWithId.startTime,
      endTime: createdWithId.endTime,
      notes: createdWithId.notes,
      eventMasterId: createdWithId.eventMasterId,
      eventMasterName: createdWithId.eventMasterName,
      locationId: createdWithId.locationId,
      locationName: createdWithId.locationName,
      address: createdWithId.address,
      interviewerIds: params.interviewerIds,
    });
  }

  async update(params: UpdateParams): Promise<EventResponseDto> {
    if (!params.id) {
      throw new BadRequestError(UPDATE.ID_REQUIRED);
    }

    if (!params.userId) {
      throw new BadRequestError(UPDATE.USER_ID_REQUIRED);
    }

    const existingEvent = await this.eventRepository.findOne({
      id: params.id,
    });

    if (!existingEvent) {
      throw new NotFoundError('イベント', params.id);
    }

    // ロケーションの存在確認
    const location = await this.eventLocationDao.findOne({
      id: params.locationId,
    });
    if (!location) {
      throw new NotFoundError('ロケーション', params.locationId);
    }

    // エンティティの振る舞いメソッドを使用して更新
    existingEvent.changeInfo({
      startTime: parseISOString(params.startTime),
      endTime: params.endTime ? parseISOString(params.endTime) : null,
      notes: params.notes,
      locationId: params.locationId,
      locationName: location.name,
      address: params.address,
      updatedBy: params.userId,
    });

    const updated = await this.eventRepository.update(
      existingEvent,
      params.interviewerIds || [],
      params.userId,
    );
    const updatedWithId: EventEntity & { id: string } =
      updated as EventEntity & { id: string };
    updatedWithId.ensureId();
    return new EventResponseDto({
      id: updatedWithId.id,
      startTime: updatedWithId.startTime,
      endTime: updatedWithId.endTime,
      notes: updatedWithId.notes,
      eventMasterId: updatedWithId.eventMasterId,
      eventMasterName: updatedWithId.eventMasterName,
      locationId: updatedWithId.locationId,
      locationName: updatedWithId.locationName,
      address: updatedWithId.address,
      interviewerIds: params.interviewerIds,
    });
  }

  async delete(params: DeleteParams): Promise<void> {
    if (!params.id) {
      throw new BadRequestError(DELETE.ID_REQUIRED);
    }

    if (!params.userId) {
      throw new BadRequestError(DELETE.USER_ID_REQUIRED);
    }

    await this.eventRepository.delete({ id: params.id });
  }

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
    return this.eventBulkService.bulkCreate(params);
  }
}
