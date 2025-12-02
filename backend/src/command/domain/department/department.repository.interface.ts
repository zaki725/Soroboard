import { DepartmentEntity } from './department.entity';

export interface IDepartmentRepository {
  create(department: DepartmentEntity): Promise<DepartmentEntity>;
  update(department: DepartmentEntity): Promise<DepartmentEntity>;
  delete({ id }: { id: string }): Promise<void>;
  findOne({ id }: { id: string }): Promise<DepartmentEntity | null>;
}
