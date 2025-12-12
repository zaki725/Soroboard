import { AuthUserEntity } from './auth-user.entity';

export interface IAuthUserRepository {
  findByEmail(email: string): Promise<AuthUserEntity | null>;
}

