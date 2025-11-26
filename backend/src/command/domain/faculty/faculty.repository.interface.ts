import {
  FacultyEntity,
  CreateFacultyEntity,
  UpdateFacultyEntity,
} from './faculty.entity';

export interface IFacultyRepository {
  create(faculty: CreateFacultyEntity): Promise<FacultyEntity>;
  update(faculty: UpdateFacultyEntity): Promise<FacultyEntity>;
  delete({ id }: { id: string }): Promise<void>;
}
