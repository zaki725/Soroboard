import { Department as PrismaDepartment } from '@prisma/client';
import { DepartmentEntity } from './department.entity';

/**
 * DepartmentエンティティとPrismaデータの変換を行うMapper
 */
export class DepartmentMapper {
  /**
   * DBのデータ(Prisma) → ドメインエンティティ
   */
  static toDomain(raw: PrismaDepartment): DepartmentEntity {
    return DepartmentEntity.create({
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
  static toPersistence(entity: DepartmentEntity): {
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
  static toUpdatePersistence(entity: DepartmentEntity): {
    name: string;
    updatedBy: string;
  } {
    return {
      name: entity.name,
      updatedBy: entity.updatedBy,
    };
  }
}
