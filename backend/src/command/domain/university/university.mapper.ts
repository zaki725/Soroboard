import { University as PrismaUniversity } from '@prisma/client';
import { UniversityEntity } from './university.entity';

/**
 * UniversityエンティティとPrismaデータの変換を行うMapper
 */
export class UniversityMapper {
  /**
   * DBのデータ(Prisma) → ドメインエンティティ
   */
  static toDomain(raw: PrismaUniversity): UniversityEntity {
    return UniversityEntity.create({
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
  static toPersistence(entity: UniversityEntity): {
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
   * 注意: updatedAtはPrismaの@updatedAtディレクティブで自動管理されるため含めません
   */
  static toUpdatePersistence(entity: UniversityEntity): {
    name: string;
    updatedBy: string;
  } {
    return {
      name: entity.name,
      updatedBy: entity.updatedBy,
    };
  }
}
