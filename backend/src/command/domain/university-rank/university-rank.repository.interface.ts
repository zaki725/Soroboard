import {
  UniversityRankEntity,
  CreateUniversityRankEntity,
  UpdateUniversityRankEntity,
} from './university-rank.entity';

export interface IUniversityRankRepository {
  create(rank: CreateUniversityRankEntity): Promise<UniversityRankEntity>;
  update(rank: UpdateUniversityRankEntity): Promise<UniversityRankEntity>;
  delete({ id }: { id: string }): Promise<void>;
  findByUniversityId({
    universityId,
  }: {
    universityId: string;
  }): Promise<UniversityRankEntity | null>;
}
