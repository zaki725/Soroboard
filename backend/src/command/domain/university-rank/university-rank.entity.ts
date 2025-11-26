import { UniversityRankLevel } from '@prisma/client';

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
  private constructor(props: UniversityRankProps) {
    this.id = props.id;
    this.universityId = props.universityId;
    this.rank = props.rank;
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this.updatedAt = props.updatedAt;
    this.updatedBy = props.updatedBy;
  }

  /**
   * エンティティのファクトリメソッド
   */
  static create(props: UniversityRankProps): UniversityRankEntity {
    return new UniversityRankEntity(props);
  }

  id: string;
  universityId: string;
  rank: UniversityRankLevel;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export class CreateUniversityRankEntity {
  constructor({
    universityId,
    rank,
    createdBy,
    updatedBy,
  }: {
    universityId: string;
    rank: UniversityRankLevel;
    createdBy: string;
    updatedBy: string;
  }) {
    this.universityId = universityId;
    this.rank = rank;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
  }

  universityId: string;
  rank: UniversityRankLevel;
  createdBy: string;
  updatedBy: string;
}

export class UpdateUniversityRankEntity {
  constructor({
    id,
    rank,
    updatedBy,
  }: {
    id: string;
    rank: UniversityRankLevel;
    updatedBy: string;
  }) {
    this.id = id;
    this.rank = rank;
    this.updatedBy = updatedBy;
  }

  id: string;
  rank: UniversityRankLevel;
  updatedBy: string;
}
