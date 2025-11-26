import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { EventMasterEntity } from '../../domain/event-master/event-master.entity';
import { IEventMasterRepository } from '../../domain/event-master/event-master.repository.interface';
import { EventMasterMapper } from '../../domain/event-master/event-master.mapper';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { DELETE } from '../../../common/constants';

@Injectable()
export class EventMasterRepository implements IEventMasterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne({ id }: { id: string }): Promise<EventMasterEntity | null> {
    const eventMasterData = await this.prisma.eventMaster.findUnique({
      where: { id },
    });

    if (!eventMasterData) {
      return null;
    }

    return EventMasterMapper.toDomain(eventMasterData);
  }

  async create(eventMaster: EventMasterEntity): Promise<EventMasterEntity> {
    try {
      const eventMasterData = await this.prisma.eventMaster.create({
        data: EventMasterMapper.toPersistence(eventMaster),
      });

      return EventMasterMapper.toDomain(eventMasterData);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestError('このイベント名は既に登録されています');
      }
      throw error;
    }
  }

  async update(eventMaster: EventMasterEntity): Promise<EventMasterEntity> {
    try {
      const eventMasterData = await this.prisma.eventMaster.update({
        where: { id: eventMaster.id },
        data: EventMasterMapper.toUpdatePersistence(eventMaster),
      });

      return EventMasterMapper.toDomain(eventMasterData);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('イベントマスター', eventMaster.id);
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestError('このイベント名は既に登録されています');
      }
      throw error;
    }
  }

  async delete({ id }: { id: string }): Promise<void> {
    try {
      await this.prisma.eventMaster.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('イベントマスター', id);
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
