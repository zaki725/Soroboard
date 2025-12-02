import { EventLocation as PrismaEventLocation } from '@prisma/client';
import { EventLocationEntity } from './event-location.entity';

/**
 * EventLocationエンティティとPrismaデータの変換を行うMapper
 */
export class EventLocationMapper {
  /**
   * DBのデータ(Prisma) → ドメインエンティティ
   */
  static toDomain(raw: PrismaEventLocation): EventLocationEntity {
    return EventLocationEntity.create({
      id: raw.id,
      name: raw.name,
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
  static toPersistence(entity: EventLocationEntity): {
    name: string;
    createdBy: string;
    updatedBy: string;
  } {
    return {
      name: entity.name,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    };
  }

  /**
   * ドメインエンティティ → DB更新時のデータ形式
   */
  static toUpdatePersistence(entity: EventLocationEntity): {
    name: string;
    updatedBy: string;
  } {
    return {
      name: entity.name,
      updatedBy: entity.updatedBy,
    };
  }
}
