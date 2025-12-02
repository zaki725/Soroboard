import { UniversityRankLevel } from '@prisma/client';
import { Id } from '../value-objects/id.vo';
import { ulid } from 'ulid';
import { getCurrentDate } from '../../../common/utils/date.utils';

interface UniversityRankProps {
  id: string;
  universityId: string;
  rank: UniversityRankLevel;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export class UniversityRankEntity {
  id: string;
  readonly _universityId: string;
  rank: UniversityRankLevel;
  readonly createdAt: Date;
  readonly createdBy: string;
  updatedAt: Date;
  updatedBy: string;

  private constructor(props: UniversityRankProps) {
    this.id = props.id;
    this._universityId = Id.createRequired(props.universityId, '大学ID').value;
    this.rank = props.rank;
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this.updatedAt = props.updatedAt;
    this.updatedBy = props.updatedBy;
  }

  get universityId(): string {
    return this._universityId;
  }

  /**
   * エンティティのファクトリメソッド（新規作成用）
   */
  static createNew(props: {
    universityId: string;
    rank: UniversityRankLevel;
    createdBy: string;
    updatedBy: string;
  }): UniversityRankEntity {
    // エンティティは生成された瞬間からアイデンティティ（ID）を持つ
    return new UniversityRankEntity({
      id: ulid(),
      universityId: props.universityId,
      rank: props.rank,
      createdAt: getCurrentDate(),
      createdBy: props.createdBy,
      updatedAt: getCurrentDate(),
      updatedBy: props.updatedBy,
    });
  }

  /**
   * エンティティのファクトリメソッド（既存データから復元用）
   */
  static create(props: UniversityRankProps): UniversityRankEntity {
    return new UniversityRankEntity(props);
  }
}
