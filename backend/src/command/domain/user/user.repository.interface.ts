import { User } from '@prisma/client';
import { UserEntity } from './user.entity';

export interface IUserRepository {
  create(user: UserEntity): Promise<User>;
  update(user: UserEntity): Promise<User>;
  findById(id: string): Promise<UserEntity | null>;
}
