import { RecruitYear as PrismaRecruitYear } from '@prisma/client';
import { RecruitYearEntity } from './recruit-year.entity';

/**
 * RecruitYearエンティティとPrismaデータの変換を行うMapper
 */
export class RecruitYearMapper {
  /**
   * DBのデータ(Prisma) → ドメインエンティティ
   */
  static toDomain(raw: PrismaRecruitYear): RecruitYearEntity {
    return RecruitYearEntity.create({
      recruitYear: raw.recruitYear,
      displayName: raw.displayName,
      themeColor: raw.themeColor,
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
  static toPersistence(entity: RecruitYearEntity): {
    recruitYear: number;
    displayName: string;
    themeColor: string;
    createdBy: string;
    updatedBy: string;
  } {
    return {
      recruitYear: entity.recruitYear,
      displayName: entity.displayName,
      themeColor: entity.themeColor,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    };
  }

  /**
   * ドメインエンティティ → DB更新時のデータ形式
   */
  static toUpdatePersistence(entity: RecruitYearEntity): {
    displayName: string;
    themeColor: string;
    updatedBy: string;
  } {
    return {
      displayName: entity.displayName,
      themeColor: entity.themeColor,
      updatedBy: entity.updatedBy,
    };
  }
}
