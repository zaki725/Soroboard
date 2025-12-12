import { AuthUser as PrismaAuthUser } from '@prisma/client';
import { AuthUserEntity } from './auth-user.entity';

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
      role: raw.role,
    });
  }
}

