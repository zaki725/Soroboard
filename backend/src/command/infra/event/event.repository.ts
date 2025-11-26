import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { EventEntity } from '../../domain/event/event.entity';
import { IEventRepository } from '../../domain/event/event.repository.interface';
import { EventMapper } from '../../domain/event/event.mapper';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { DELETE } from '../../../common/constants';

@Injectable()
export class EventRepository implements IEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne({ id }: { id: string }): Promise<EventEntity | null> {
    const eventData = await this.prisma.event.findUnique({
      where: { id },
      include: {
        eventMaster: true,
        location: true,
      },
    });

    if (!eventData) {
      return null;
    }

    return EventMapper.toDomain(eventData);
  }

  async create(
    event: EventEntity,
    interviewerIds: string[],
    userId: string,
  ): Promise<EventEntity> {
    try {
      const eventData = await this.prisma.$transaction(async (tx) => {
        const createdEvent = await tx.event.create({
          data: EventMapper.toPersistence(event),
          include: {
            eventMaster: true,
            location: true,
          },
        });

        if (interviewerIds.length > 0) {
          await tx.eventInterviewer.createMany({
            data: interviewerIds.map((interviewerId) => ({
              eventId: createdEvent.id,
              interviewerId,
              createdBy: userId,
              updatedBy: userId,
            })),
            skipDuplicates: true,
          });
        }

        return createdEvent;
      });

      return EventMapper.toDomain(eventData);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestError(
          'イベントマスターまたはロケーションが見つかりません',
        );
      }
      throw error;
    }
  }

  async update(
    event: EventEntity,
    interviewerIds: string[],
    userId: string,
  ): Promise<EventEntity> {
    try {
      event.ensureId();
      const eventId = event.id;

      const eventData = await this.prisma.$transaction(async (tx) => {
        const updatedEvent = await tx.event.update({
          where: { id: eventId },
          data: EventMapper.toUpdatePersistence(event),
          include: {
            eventMaster: true,
            location: true,
          },
        });

        // 既存の面接官を削除
        await tx.eventInterviewer.deleteMany({
          where: { eventId },
        });

        // 新しい面接官を追加
        if (interviewerIds.length > 0) {
          await tx.eventInterviewer.createMany({
            data: interviewerIds.map((interviewerId) => ({
              eventId,
              interviewerId,
              createdBy: userId,
              updatedBy: userId,
            })),
            skipDuplicates: true,
          });
        }

        return updatedEvent;
      });

      return EventMapper.toDomain(eventData);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('イベント', event.id || '');
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestError('ロケーションが見つかりません');
      }
      throw error;
    }
  }

  async delete({ id }: { id: string }): Promise<void> {
    try {
      await this.prisma.event.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('イベント', id);
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
