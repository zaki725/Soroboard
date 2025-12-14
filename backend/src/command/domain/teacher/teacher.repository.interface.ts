import { TeacherEntity } from './teacher.entity';

export interface ITeacherRepository {
  findByEmail(email: string): Promise<TeacherEntity | null>;
}

