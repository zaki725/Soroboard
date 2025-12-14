import { PrismaClient, AuthUserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ulid } from 'ulid';

/**
 * AuthUser シード作成用
 * ログイン用のアカウントを作成
 */
export async function seedAuthUsers({ prisma }: { prisma: PrismaClient }) {
  console.log('AuthUser シード作成を開始...');

  // 既存のデータを物理削除
  await prisma.authUser.deleteMany({});

  // パスワード "password123" をハッシュ化（テストコードと同じハッシュを使用）
  // テストコードのハッシュ: $2b$04$8R1Q2A4kJ/sSm.mkQwYDK.mZTGFLxyqbTO3uN4flOi.jFfsjVt6PW
  // 開発環境用に新しいハッシュを生成（cost=10）
  const passwordHash = await bcrypt.hash('password123', 10);

  const systemUserId = 'system';

  // 既存のTeacherテーブルのメールアドレスに対応するAuthUserを作成
  const teachers = await prisma.teacher.findMany({
    select: { email: true },
  });

  if (teachers.length === 0) {
    console.log('Teacher テーブルにデータがないため、AuthUser シードをスキップします');
    return;
  }

  // 一括作成
  await prisma.authUser.createMany({
    data: teachers.map((teacher) => ({
      id: ulid(),
      email: teacher.email,
      passwordHash,
      role: AuthUserRole.TEACHER,
      createdBy: systemUserId,
      updatedBy: systemUserId,
    })),
  });

  console.log(`${teachers.length} 件の AuthUser 作成完了`);
}

