import { UniversityRank as PrismaUniversityRank } from '@prisma/client';
import { UniversityRankEntity } from './university-rank.entity';

/**
 * UniversityRankエンティティとPrismaデータの変換を行うMapper
 */
export class UniversityRankMapper {
  /**
   * DBのデータ(Prisma) → ドメインエンティティ
   */
  static toDomain(raw: PrismaUniversityRank): UniversityRankEntity {
    return UniversityRankEntity.create({
      id: raw.id,
      universityId: raw.universityId,
      rank: raw.rank,
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
  static toPersistence(entity: UniversityRankEntity): {
    universityId: string;
    rank: string;
    createdBy: string;
    updatedBy: string;
  } {
    return {
      universityId: entity.universityId,
      rank: entity.rank,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    };
  }

  /**
   * ドメインエンティティ → DB更新時のデータ形式
   */
  static toUpdatePersistence(entity: UniversityRankEntity): {
    rank: string;
    updatedBy: string;
  } {
    return {
      rank: entity.rank,
      updatedBy: entity.updatedBy,
    };
  }
}
