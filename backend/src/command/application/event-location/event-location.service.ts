import { Injectable, Inject } from '@nestjs/common';
import type { IEventLocationRepository } from '../../domain/event-location/event-location.repository.interface';
import { EventLocationEntity } from '../../domain/event-location/event-location.entity';
import { EventLocationResponseDto } from '../../../query/dto/event-location/event-location.dto';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { CREATE, UPDATE, DELETE } from '../../../common/constants';

type CreateParams = {
  name: string;
  userId: string;
};

type UpdateParams = {
  id: string;
  name: string;
  userId: string;
};

type DeleteParams = {
  id: string;
  userId: string;
};

@Injectable()
export class EventLocationService {
  constructor(
    @Inject(INJECTION_TOKENS.IEventLocationRepository)
    private readonly eventLocationRepository: IEventLocationRepository,
  ) {}

  async create(params: CreateParams): Promise<EventLocationResponseDto> {
    if (!params.userId) {
      throw new BadRequestError(CREATE.USER_ID_REQUIRED);
    }

    const eventLocationEntity = EventLocationEntity.create({
      name: params.name,
      createdBy: params.userId,
      updatedBy: params.userId,
    });

    const created =
      await this.eventLocationRepository.create(eventLocationEntity);
    const createdWithId: EventLocationEntity & { id: string } =
      created as EventLocationEntity & { id: string };
    createdWithId.ensureId();
    return new EventLocationResponseDto({
      id: createdWithId.id,
      name: createdWithId.name,
    });
  }

  async update(params: UpdateParams): Promise<EventLocationResponseDto> {
    if (!params.id) {
      throw new BadRequestError(UPDATE.ID_REQUIRED);
    }

    if (!params.userId) {
      throw new BadRequestError(UPDATE.USER_ID_REQUIRED);
    }

    const existingEventLocation = await this.eventLocationRepository.findOne({
      id: params.id,
    });

    if (!existingEventLocation) {
      throw new NotFoundError('ロケーション', params.id);
    }

    // エンティティの振る舞いメソッドを使用して更新
    existingEventLocation.changeName({
      name: params.name,
      updatedBy: params.userId,
    });

    const updated = await this.eventLocationRepository.update(
      existingEventLocation,
    );
    const updatedWithId: EventLocationEntity & { id: string } =
      updated as EventLocationEntity & { id: string };
    updatedWithId.ensureId();
    return new EventLocationResponseDto({
      id: updatedWithId.id,
      name: updatedWithId.name,
    });
  }

  async delete(params: DeleteParams): Promise<void> {
    if (!params.id) {
      throw new BadRequestError(DELETE.ID_REQUIRED);
    }

    if (!params.userId) {
      throw new BadRequestError(DELETE.USER_ID_REQUIRED);
    }

    await this.eventLocationRepository.delete({ id: params.id });
  }

  async bulkCreate(params: {
    eventLocations: Array<{
      name: string;
    }>;
    userId: string;
  }): Promise<EventLocationResponseDto[]> {
    if (!params.userId) {
      throw new BadRequestError(CREATE.USER_ID_REQUIRED);
    }

    if (!params.eventLocations || params.eventLocations.length === 0) {
      throw new BadRequestError('ロケーションは1件以上必要です');
    }

    const createdEventLocations: EventLocationResponseDto[] = [];

    for (const eventLocationData of params.eventLocations) {
      const eventLocationEntity = EventLocationEntity.create({
        name: eventLocationData.name,
        createdBy: params.userId,
        updatedBy: params.userId,
      });

      const created =
        await this.eventLocationRepository.create(eventLocationEntity);
      const createdWithId: EventLocationEntity & { id: string } =
        created as EventLocationEntity & { id: string };
      createdWithId.ensureId();
      createdEventLocations.push(
        new EventLocationResponseDto({
          id: createdWithId.id,
          name: createdWithId.name,
        }),
      );
    }

    return createdEventLocations;
  }
}
