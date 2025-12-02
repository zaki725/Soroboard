import type { UniversityEntity } from './university.entity';

export interface IUniversityRepository {
  create(university: UniversityEntity): Promise<UniversityEntity>;
  update(university: UniversityEntity): Promise<UniversityEntity>;
  delete({ id }: { id: string }): Promise<void>;
  findOne({ id }: { id: string }): Promise<UniversityEntity | null>;
}
