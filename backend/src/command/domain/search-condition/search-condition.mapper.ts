import { SearchCondition } from '@prisma/client';
import { SearchConditionEntity } from './search-condition.entity';

export class SearchConditionMapper {
  static toDomain(data: SearchCondition): SearchConditionEntity {
    return SearchConditionEntity.create({
      id: data.id,
      formType: data.formType,
      name: data.name,
      urlParams: data.urlParams,
      recruitYearId: data.recruitYearId,
      createdAt: data.createdAt,
      createdBy: data.createdBy ?? '',
      updatedAt: data.updatedAt,
      updatedBy: data.updatedBy,
    });
  }

  /**
   * ドメインエンティティ → DBへ保存するデータ形式
   * (Prismaに渡すオブジェクトを作成)
   */
  static toPersistence(entity: SearchConditionEntity): {
    formType: string;
    name: string;
    urlParams: string;
    recruitYearId: number | null;
    createdBy: string;
    updatedBy: string;
  } {
    return {
      formType: entity.formType,
      name: entity.name,
      urlParams: entity.urlParams,
      recruitYearId: entity.recruitYearId,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    };
  }

  /**
   * ドメインエンティティ → DB更新時のデータ形式
   * 注意: updatedAtはPrismaの@updatedAtディレクティブで自動管理されるため含めません
   */
  static toUpdatePersistence(entity: SearchConditionEntity): {
    formType: string;
    name: string;
    urlParams: string;
    recruitYearId: number | null;
    updatedBy: string;
  } {
    return {
      formType: entity.formType,
      name: entity.name,
      urlParams: entity.urlParams,
      recruitYearId: entity.recruitYearId,
      updatedBy: entity.updatedBy,
    };
  }
}
