import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { EventLocationEntity } from '../../domain/event-location/event-location.entity';
import { IEventLocationRepository } from '../../domain/event-location/event-location.repository.interface';
import { EventLocationMapper } from '../../domain/event-location/event-location.mapper';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { DELETE } from '../../../common/constants';
import { handlePrismaError } from '../../../common/utils/prisma-error-handler';
import { CustomLoggerService } from '../../../config/custom-logger.service';

@Injectable()
export class EventLocationRepository implements IEventLocationRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

  async findOne({ id }: { id: string }): Promise<EventLocationEntity | null> {
    const eventLocationData = await this.prisma.eventLocation.findUnique({
      where: { id },
    });

    if (!eventLocationData) {
      return null;
    }

    return EventLocationMapper.toDomain(eventLocationData);
  }

  async create(
    eventLocation: EventLocationEntity,
  ): Promise<EventLocationEntity> {
    try {
      const eventLocationData = await this.prisma.eventLocation.create({
        data: EventLocationMapper.toPersistence(eventLocation),
      });

      return EventLocationMapper.toDomain(eventLocationData);
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'EventLocationRepository',
      );
      handlePrismaError(error, {
        resourceName: 'ロケーション',
        id: eventLocation.id || '',
        duplicateMessage: 'このロケーション名は既に登録されています',
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async update(
    eventLocation: EventLocationEntity,
  ): Promise<EventLocationEntity> {
    try {
      const eventLocationData = await this.prisma.eventLocation.update({
        where: { id: eventLocation.id },
        data: EventLocationMapper.toUpdatePersistence(eventLocation),
      });

      return EventLocationMapper.toDomain(eventLocationData);
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'EventLocationRepository',
      );
      handlePrismaError(error, {
        resourceName: 'ロケーション',
        id: eventLocation.id || '',
        duplicateMessage: 'このロケーション名は既に登録されています',
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async delete({ id }: { id: string }): Promise<void> {
    try {
      await this.prisma.eventLocation.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'EventLocationRepository',
      );
      handlePrismaError(error, {
        resourceName: 'ロケーション',
        id,
        foreignKeyHandler: () => {
          throw new BadRequestError(DELETE.FOREIGN_KEY_CONSTRAINT);
        },
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }
}
