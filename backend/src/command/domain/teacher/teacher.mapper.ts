import { Teacher as PrismaTeacher } from '@prisma/client';
import { TeacherEntity } from './teacher.entity';

/**
 * TeacherエンティティとPrismaデータの変換を行うMapper
 */
export class TeacherMapper {
  /**
   * DBのデータ(Prisma) → ドメインエンティティ
   */
  static toDomain(raw: PrismaTeacher): TeacherEntity {
    return TeacherEntity.create({
      id: raw.id,
      email: raw.email,
      firstName: raw.firstName,
      lastName: raw.lastName,
    });
  }
}

