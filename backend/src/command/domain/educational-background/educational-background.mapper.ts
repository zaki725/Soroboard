import { EducationalBackground as PrismaEducationalBackground } from '@prisma/client';
import {
  EducationalBackgroundEntity,
  type EducationType,
} from './educational-background.entity';

/**
 * EducationalBackgroundエンティティとPrismaデータの変換を行うMapper
 */
export class EducationalBackgroundMapper {
  /**
   * DBのデータ(Prisma) → ドメインエンティティ
   */
  static toDomain(
    raw: PrismaEducationalBackground,
  ): EducationalBackgroundEntity {
    return EducationalBackgroundEntity.create({
      id: raw.id,
      interviewerId: raw.interviewerId,
      educationType: raw.educationType as EducationType,
      universityId: raw.universityId ?? undefined,
      facultyId: raw.facultyId ?? undefined,
      graduationYear: raw.graduationYear ?? undefined,
      graduationMonth: raw.graduationMonth ?? undefined,
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
  static toPersistence(entity: EducationalBackgroundEntity): {
    interviewerId: string;
    educationType: string;
    universityId: string | null;
    facultyId: string | null;
    graduationYear: number | null;
    graduationMonth: number | null;
    createdBy: string;
    updatedBy: string;
  } {
    return {
      interviewerId: entity.interviewerId,
      educationType: entity.educationType,
      universityId: entity.universityId ?? null,
      facultyId: entity.facultyId ?? null,
      graduationYear: entity.graduationYear ?? null,
      graduationMonth: entity.graduationMonth ?? null,
      createdBy: entity.createdBy ?? '',
      updatedBy: entity.updatedBy,
    };
  }

  /**
   * ドメインエンティティ → DB更新時のデータ形式
   */
  static toUpdatePersistence(entity: EducationalBackgroundEntity): {
    educationType: string;
    universityId: string | null;
    facultyId: string | null;
    graduationYear: number | null;
    graduationMonth: number | null;
    updatedBy: string;
  } {
    return {
      educationType: entity.educationType,
      universityId: entity.universityId ?? null,
      facultyId: entity.facultyId ?? null,
      graduationYear: entity.graduationYear ?? null,
      graduationMonth: entity.graduationMonth ?? null,
      updatedBy: entity.updatedBy,
    };
  }
}
