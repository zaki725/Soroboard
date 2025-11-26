import { EventMaster as PrismaEventMaster } from '@prisma/client';
import { EventMasterEntity } from './event-master.entity';

/**
 * EventMasterエンティティとPrismaデータの変換を行うMapper
 */
export class EventMasterMapper {
  /**
   * DBのデータ(Prisma) → ドメインエンティティ
   */
  static toDomain(raw: PrismaEventMaster): EventMasterEntity {
    return EventMasterEntity.create({
      id: raw.id,
      name: raw.name,
      description: raw.description,
      type: raw.type as 'オンライン' | '対面' | 'オンライン_対面',
      recruitYearId: raw.recruitYearId,
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
  static toPersistence(entity: EventMasterEntity): {
    name: string;
    description: string | null;
    type: 'オンライン' | '対面' | 'オンライン_対面';
    recruitYearId: number;
    createdBy: string;
    updatedBy: string;
  } {
    return {
      name: entity.name,
      description: entity.description,
      type: entity.type,
      recruitYearId: entity.recruitYearId,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    };
  }

  /**
   * ドメインエンティティ → DB更新時のデータ形式
   */
  static toUpdatePersistence(entity: EventMasterEntity): {
    name: string;
    description: string | null;
    type: 'オンライン' | '対面' | 'オンライン_対面';
    updatedBy: string;
  } {
    return {
      name: entity.name,
      description: entity.description,
      type: entity.type,
      updatedBy: entity.updatedBy,
    };
  }
}
