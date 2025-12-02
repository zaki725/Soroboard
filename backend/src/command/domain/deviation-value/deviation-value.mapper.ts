import { DeviationValue as PrismaDeviationValue } from '@prisma/client';
import { DeviationValueEntity } from './deviation-value.entity';

/**
 * DeviationValueエンティティとPrismaデータの変換を行うMapper
 */
export class DeviationValueMapper {
  /**
   * DBのデータ(Prisma) → ドメインエンティティ
   */
  static toDomain(raw: PrismaDeviationValue): DeviationValueEntity {
    return DeviationValueEntity.create({
      id: raw.id,
      facultyId: raw.facultyId,
      value: raw.value,
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
  static toPersistence(entity: DeviationValueEntity): {
    id: string;
    facultyId: string;
    value: number;
    createdBy: string;
    updatedBy: string;
  } {
    return {
      id: entity.id,
      facultyId: entity.facultyId,
      value: entity.value,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    };
  }

  /**
   * ドメインエンティティ → DB更新時のデータ形式
   */
  static toUpdatePersistence(entity: DeviationValueEntity): {
    value: number;
    updatedBy: string;
  } {
    return {
      value: entity.value,
      updatedBy: entity.updatedBy,
    };
  }
}
