import {
  UniversityEntity,
  CreateUniversityEntity,
  UpdateUniversityEntity,
} from './university.entity';

export interface IUniversityRepository {
  create(university: CreateUniversityEntity): Promise<UniversityEntity>;
  update(university: UpdateUniversityEntity): Promise<UniversityEntity>;
  delete({ id }: { id: string }): Promise<void>;
  findOne({ id }: { id: string }): Promise<UniversityEntity | null>;
}
