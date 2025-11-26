import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { EventLocationEntity } from '../../domain/event-location/event-location.entity';
import { IEventLocationRepository } from '../../domain/event-location/event-location.repository.interface';
import { EventLocationMapper } from '../../domain/event-location/event-location.mapper';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { DELETE } from '../../../common/constants';

@Injectable()
export class EventLocationRepository implements IEventLocationRepository {
  constructor(private readonly prisma: PrismaService) {}

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
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestError('このロケーション名は既に登録されています');
      }
      throw error;
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
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('ロケーション', eventLocation.id);
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestError('このロケーション名は既に登録されています');
      }
      throw error;
    }
  }

  async delete({ id }: { id: string }): Promise<void> {
    try {
      await this.prisma.eventLocation.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('ロケーション', id);
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestError(DELETE.FOREIGN_KEY_CONSTRAINT);
      }
      throw error;
    }
  }
}
