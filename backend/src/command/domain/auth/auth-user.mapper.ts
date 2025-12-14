import {
  AuthUser as PrismaAuthUser,
  AuthUserRole as PrismaAuthUserRole,
} from '@prisma/client';
import { AuthUserEntity } from './auth-user.entity';
import type { AuthUserRole } from './auth-user-role';
import { InternalServerError } from '../../../common/errors/internal-server.error';
import { UNSUPPORTED_AUTH_USER_ROLE } from '../../../common/constants';

/**
 * AuthUserエンティティとPrismaデータの変換を行うMapper
 */
export class AuthUserMapper {
  /**
   * DBのデータ(Prisma) → ドメインエンティティ
   */
  static toDomain(raw: PrismaAuthUser): AuthUserEntity {
    return AuthUserEntity.create({
      id: raw.id,
      email: raw.email,
      passwordHash: raw.passwordHash,
      role: this.toDomainRole(raw.role),
    });
  }

  /**
   * PrismaのAuthUserRole → ドメインのAuthUserRole
   */
  private static toDomainRole(role: PrismaAuthUserRole): AuthUserRole {
    switch (role) {
      case 'TEACHER':
        return 'TEACHER';
      case 'ADMIN':
        return 'ADMIN';
      default:
        throw new InternalServerError(UNSUPPORTED_AUTH_USER_ROLE(role));
    }
  }
}

