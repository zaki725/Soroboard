import { Company as PrismaCompany } from '@prisma/client';
import { CompanyEntity } from './company.entity';

/**
 * CompanyエンティティとPrismaデータの変換を行うMapper
 */
export class CompanyMapper {
  /**
   * DBのデータ(Prisma) → ドメインエンティティ
   */
  static toDomain(raw: PrismaCompany): CompanyEntity {
    return CompanyEntity.create({
      id: raw.id,
      name: raw.name,
      phoneNumber: raw.phoneNumber,
      email: raw.email,
      websiteUrl: raw.websiteUrl,
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
  static toPersistence(entity: CompanyEntity): {
    name: string;
    phoneNumber: string | null;
    email: string | null;
    websiteUrl: string | null;
    recruitYearId: number;
    createdBy: string;
    updatedBy: string;
  } {
    return {
      name: entity.name,
      phoneNumber: entity.phoneNumber,
      email: entity.email,
      websiteUrl: entity.websiteUrl,
      recruitYearId: entity.recruitYearId,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    };
  }

  /**
   * ドメインエンティティ → DB更新時のデータ形式
   */
  static toUpdatePersistence(entity: CompanyEntity): {
    name: string;
    phoneNumber: string | null;
    email: string | null;
    websiteUrl: string | null;
    recruitYearId: number;
    updatedBy: string;
  } {
    return {
      name: entity.name,
      phoneNumber: entity.phoneNumber,
      email: entity.email,
      websiteUrl: entity.websiteUrl,
      recruitYearId: entity.recruitYearId,
      updatedBy: entity.updatedBy,
    };
  }
}
