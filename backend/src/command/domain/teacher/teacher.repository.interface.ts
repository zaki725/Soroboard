import { TeacherEntity } from './teacher.entity';

export interface ITeacherRepository {
  findByAuthUserId(authUserId: string): Promise<TeacherEntity | null>;
}

