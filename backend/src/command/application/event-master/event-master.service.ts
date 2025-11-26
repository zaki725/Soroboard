import { Injectable, Inject } from '@nestjs/common';
import type { IEventMasterRepository } from '../../domain/event-master/event-master.repository.interface';
import { EventMasterEntity } from '../../domain/event-master/event-master.entity';
import { EventMasterResponseDto } from '../../../query/dto/event-master/event-master.dto';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { CREATE, UPDATE, DELETE } from '../../../common/constants';
import type { LocationType } from '../../../common/enums';

type CreateParams = {
  name: string;
  description?: string | null;
  type: LocationType;
  recruitYearId: number;
  userId: string;
};

type UpdateParams = {
  id: string;
  name: string;
  description?: string | null;
  type: LocationType;
  userId: string;
};

type DeleteParams = {
  id: string;
  userId: string;
};

@Injectable()
export class EventMasterService {
  constructor(
    @Inject(INJECTION_TOKENS.IEventMasterRepository)
    private readonly eventMasterRepository: IEventMasterRepository,
  ) {}

  async create(params: CreateParams): Promise<EventMasterResponseDto> {
    if (!params.userId) {
      throw new BadRequestError(CREATE.USER_ID_REQUIRED);
    }

    const eventMasterEntity = EventMasterEntity.create({
      name: params.name,
      description: params.description,
      type: params.type,
      recruitYearId: params.recruitYearId,
      createdBy: params.userId,
      updatedBy: params.userId,
    });

    const created = await this.eventMasterRepository.create(eventMasterEntity);
    const createdWithId: EventMasterEntity & { id: string } =
      created as EventMasterEntity & { id: string };
    createdWithId.ensureId();
    return new EventMasterResponseDto({
      id: createdWithId.id,
      name: createdWithId.name,
      description: createdWithId.description,
      type: createdWithId.type,
      recruitYearId: createdWithId.recruitYearId,
    });
  }

  async update(params: UpdateParams): Promise<EventMasterResponseDto> {
    if (!params.id) {
      throw new BadRequestError(UPDATE.ID_REQUIRED);
    }

    if (!params.userId) {
      throw new BadRequestError(UPDATE.USER_ID_REQUIRED);
    }

    const existingEventMaster = await this.eventMasterRepository.findOne({
      id: params.id,
    });

    if (!existingEventMaster) {
      throw new NotFoundError('イベントマスター', params.id);
    }

    // エンティティの振る舞いメソッドを使用して更新
    existingEventMaster.changeInfo({
      name: params.name,
      description: params.description,
      type: params.type,
      updatedBy: params.userId,
    });

    const updated =
      await this.eventMasterRepository.update(existingEventMaster);
    const updatedWithId: EventMasterEntity & { id: string } =
      updated as EventMasterEntity & { id: string };
    updatedWithId.ensureId();
    return new EventMasterResponseDto({
      id: updatedWithId.id,
      name: updatedWithId.name,
      description: updatedWithId.description,
      type: updatedWithId.type,
      recruitYearId: updatedWithId.recruitYearId,
    });
  }

  async delete(params: DeleteParams): Promise<void> {
    if (!params.id) {
      throw new BadRequestError(DELETE.ID_REQUIRED);
    }

    if (!params.userId) {
      throw new BadRequestError(DELETE.USER_ID_REQUIRED);
    }

    await this.eventMasterRepository.delete({ id: params.id });
  }

  async bulkCreate(params: {
    eventMasters: Array<{
      name: string;
      description?: string | null;
      type: LocationType;
      recruitYearId: number;
    }>;
    userId: string;
  }): Promise<EventMasterResponseDto[]> {
    if (!params.userId) {
      throw new BadRequestError(CREATE.USER_ID_REQUIRED);
    }

    if (!params.eventMasters || params.eventMasters.length === 0) {
      throw new BadRequestError('イベントマスターは1件以上必要です');
    }

    const createdEventMasters: EventMasterResponseDto[] = [];

    for (const eventMasterData of params.eventMasters) {
      const eventMasterEntity = EventMasterEntity.create({
        name: eventMasterData.name,
        description: eventMasterData.description,
        type: eventMasterData.type,
        recruitYearId: eventMasterData.recruitYearId,
        createdBy: params.userId,
        updatedBy: params.userId,
      });

      const created =
        await this.eventMasterRepository.create(eventMasterEntity);

      const createdWithId: EventMasterEntity & { id: string } =
        created as EventMasterEntity & { id: string };

      createdWithId.ensureId();

      createdEventMasters.push(
        new EventMasterResponseDto({
          id: createdWithId.id,
          name: createdWithId.name,
          description: createdWithId.description,
          type: createdWithId.type,
          recruitYearId: createdWithId.recruitYearId,
        }),
      );
    }

    return createdEventMasters;
  }
}
