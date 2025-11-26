import { Faculty as PrismaFaculty } from '@prisma/client';
import { FacultyEntity } from './faculty.entity';

/**
 * FacultyエンティティとPrismaデータの変換を行うMapper
 */
export class FacultyMapper {
  /**
   * DBのデータ(Prisma) → ドメインエンティティ
   */
  static toDomain(raw: PrismaFaculty): FacultyEntity {
    return FacultyEntity.create({
      id: raw.id,
      name: raw.name,
      universityId: raw.universityId,
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
  static toPersistence(entity: FacultyEntity): {
    name: string;
    universityId: string;
    createdBy: string;
    updatedBy: string;
  } {
    return {
      name: entity.name,
      universityId: entity.universityId,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    };
  }

  /**
   * ドメインエンティティ → DB更新時のデータ形式
   */
  static toUpdatePersistence(entity: FacultyEntity): {
    name: string;
    updatedBy: string;
  } {
    return {
      name: entity.name,
      updatedBy: entity.updatedBy,
    };
  }
}
