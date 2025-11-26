import { Event as PrismaEvent } from '@prisma/client';
import { EventEntity } from './event.entity';

/**
 * EventエンティティとPrismaデータの変換を行うMapper
 */
export class EventMapper {
  /**
   * DBのデータ(Prisma) → ドメインエンティティ
   */
  static toDomain(
    raw: PrismaEvent & {
      eventMaster: { name: string };
      location: { name: string };
    },
  ): EventEntity {
    if (!raw.startTime) {
      throw new Error('開始時刻は必須です');
    }
    return EventEntity.create({
      id: raw.id,
      startTime: raw.startTime,
      endTime: raw.endTime,
      notes: raw.notes,
      eventMasterId: raw.eventMasterId,
      eventMasterName: raw.eventMaster.name,
      locationId: raw.locationId,
      locationName: raw.location.name,
      address: raw.address,
      createdAt: raw.createdAt,
      createdBy: raw.createdBy,
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy,
    });
  }

  /**
   * ドメインエンティティ → DBへ保存するデータ形式
   * (Prismaに渡すオブジェクトを作成)
   */
  static toPersistence(entity: EventEntity): {
    startTime: Date;
    endTime: Date | null;
    notes: string | null;
    eventMasterId: string;
    locationId: string;
    address: string | null;
    createdBy: string;
    updatedBy: string;
  } {
    return {
      startTime: entity.startTime,
      endTime: entity.endTime,
      notes: entity.notes,
      eventMasterId: entity.eventMasterId,
      locationId: entity.locationId,
      address: entity.address,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    };
  }

  /**
   * ドメインエンティティ → DB更新時のデータ形式
   */
  static toUpdatePersistence(entity: EventEntity): {
    startTime: Date;
    endTime: Date | null;
    notes: string | null;
    locationId: string;
    address: string | null;
    updatedBy: string;
  } {
    return {
      startTime: entity.startTime,
      endTime: entity.endTime,
      notes: entity.notes,
      locationId: entity.locationId,
      address: entity.address,
      updatedBy: entity.updatedBy,
    };
  }
}
