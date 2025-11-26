import { User as PrismaUser, UserRole, Gender } from '@prisma/client';
import { UserEntity } from './user.entity';

/**
 * UserエンティティとPrismaデータの変換を行うMapper
 */
export class UserMapper {
  /**
   * DBのデータ(Prisma) → ドメインエンティティ
   */
  static toDomain(raw: PrismaUser): UserEntity {
    return UserEntity.create({
      id: raw.id,
      email: raw.email,
      role: raw.role,
      firstName: raw.firstName,
      lastName: raw.lastName,
      gender: raw.gender,
      departmentId: raw.departmentId,
      createdAt: raw.createdAt,
      createdBy: raw.createdBy,
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy,
    });
  }

  /**
   * ドメインエンティティ → DBへ保存するデータ形式
   * (Prismaに渡すオブジェクトを作成)
   */
  static toPersistence(entity: UserEntity): {
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    gender: Gender | null;
    departmentId: string;
    createdBy: string;
    updatedBy: string;
  } {
    return {
      email: entity.email,
      role: entity.role as UserRole,
      firstName: entity.firstName,
      lastName: entity.lastName,
      gender: entity.gender as Gender | null,
      departmentId: entity.departmentId,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    };
  }

  /**
   * ドメインエンティティ → DB更新時のデータ形式
   */
  static toUpdatePersistence(entity: UserEntity): {
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    gender: Gender | null;
    departmentId: string;
    updatedBy: string;
  } {
    return {
      email: entity.email,
      role: entity.role as UserRole,
      firstName: entity.firstName,
      lastName: entity.lastName,
      gender: entity.gender as Gender | null,
      departmentId: entity.departmentId,
      updatedBy: entity.updatedBy,
    };
  }
}
