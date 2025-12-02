import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { EventMasterEntity } from '../../domain/event-master/event-master.entity';
import { IEventMasterRepository } from '../../domain/event-master/event-master.repository.interface';
import { EventMasterMapper } from '../../domain/event-master/event-master.mapper';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { DELETE } from '../../../common/constants';
import { handlePrismaError } from '../../../common/utils/prisma-error-handler';
import { CustomLoggerService } from '../../../config/custom-logger.service';

@Injectable()
export class EventMasterRepository implements IEventMasterRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

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
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'EventMasterRepository',
      );
      handlePrismaError(error, {
        resourceName: 'イベントマスター',
        id: eventMaster.id || '',
        duplicateMessage: 'このイベント名は既に登録されています',
      });
      throw error; // 到達不能コード（型チェック用）
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
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'EventMasterRepository',
      );
      handlePrismaError(error, {
        resourceName: 'イベントマスター',
        id: eventMaster.id || '',
        duplicateMessage: 'このイベント名は既に登録されています',
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async delete({ id }: { id: string }): Promise<void> {
    try {
      await this.prisma.eventMaster.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'EventMasterRepository',
      );
      handlePrismaError(error, {
        resourceName: 'イベントマスター',
        id,
        foreignKeyHandler: () => {
          throw new BadRequestError(DELETE.FOREIGN_KEY_CONSTRAINT);
        },
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }
}
