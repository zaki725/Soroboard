import { Interviewer as PrismaInterviewer } from '@prisma/client';
import { InterviewerEntity } from './interviewer.entity';
import type { InterviewerCategory } from '../../../query/types/interviewer.types';

/**
 * InterviewerエンティティとPrismaデータの変換を行うMapper
 */
export class InterviewerMapper {
  /**
   * DBのデータ(Prisma) → ドメインエンティティ
   */
  static toDomain(raw: PrismaInterviewer): InterviewerEntity {
    return InterviewerEntity.create({
      userId: raw.userId,
      category: raw.category as InterviewerCategory,
      createdAt: raw.createdAt,
      createdBy: raw.createdBy ?? undefined,
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy,
    });
  }

  /**
   * ドメインエンティティ → DBへ保存するデータ形式
   * (Prismaに渡すオブジェクトを作成)
   */
  static toPersistence(entity: InterviewerEntity): {
    userId: string;
    category: string;
    createdBy: string;
    updatedBy: string;
  } {
    return {
      userId: entity.userId,
      category: entity.category,
      createdBy: entity.createdBy ?? '',
      updatedBy: entity.updatedBy,
    };
  }

  /**
   * ドメインエンティティ → DB更新時のデータ形式
   */
  static toUpdatePersistence(entity: InterviewerEntity): {
    category: string;
    updatedBy: string;
  } {
    return {
      category: entity.category,
      updatedBy: entity.updatedBy,
    };
  }
}
