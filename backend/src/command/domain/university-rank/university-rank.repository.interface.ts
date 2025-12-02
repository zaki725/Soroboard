import type { UniversityRankEntity } from './university-rank.entity';

export interface IUniversityRankRepository {
  create(rank: UniversityRankEntity): Promise<UniversityRankEntity>;
  update(rank: UniversityRankEntity): Promise<UniversityRankEntity>;
  delete({ id }: { id: string }): Promise<void>;
  findByUniversityId({
    universityId,
  }: {
    universityId: string;
  }): Promise<UniversityRankEntity | null>;
}
