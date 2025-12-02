import type { FacultyEntity } from './faculty.entity';

export interface IFacultyRepository {
  create(faculty: FacultyEntity): Promise<FacultyEntity>;
  update(faculty: FacultyEntity): Promise<FacultyEntity>;
  delete({ id }: { id: string }): Promise<void>;
  findOne({ id }: { id: string }): Promise<FacultyEntity | null>;
}
