import { PrismaClient, UserRole, Gender } from '@prisma/client';
import { ulid } from 'ulid';

/**
 * User シード作成用
 */
export async function seedUsers({ prisma }: { prisma: PrismaClient }) {
  console.log('User シード作成を開始...');

  // システム本部を取得
  const systemDept = await prisma.department.findUnique({
    where: { name: 'システム本部' },
  });

  if (!systemDept) {
    throw new Error(
      'システム本部が見つかりません。先にDepartmentシードを実行してください。',
    );
  }

  // 既存のデータを削除
  await prisma.user.deleteMany();

  const systemUserId = ulid();

  // Systemユーザー（master）を作成
  await prisma.user.create({
    data: {
      id: systemUserId,
      email: 'system@example.local',
      role: UserRole.master,
      firstName: 'Master',
      lastName: 'System',
      gender: Gender.other,
      departmentId: systemDept.id,
      createdBy: systemUserId,
      updatedBy: systemUserId,
    },
  });

  // シードデータを追加
  const users = await prisma.user.createMany({
    data: [
      {
        id: ulid(),
        email: 'yamada@example.com',
        role: UserRole.user,
        firstName: '太郎',
        lastName: '山田',
        gender: Gender.male,
        departmentId: systemDept.id,
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
      {
        id: ulid(),
        email: 'sato@example.com',
        role: UserRole.user,
        firstName: '花子',
        lastName: '佐藤',
        gender: Gender.female,
        departmentId: systemDept.id,
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
      {
        id: ulid(),
        email: 'suzuki@example.com',
        role: UserRole.admin,
        firstName: '一郎',
        lastName: '鈴木',
        gender: Gender.male,
        departmentId: systemDept.id,
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
      {
        id: ulid(),
        email: 'takahashi@example.com',
        role: UserRole.user,
        firstName: 'みどり',
        lastName: '高橋',
        gender: Gender.female,
        departmentId: systemDept.id,
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
      {
        id: ulid(),
        email: 'ito@example.com',
        role: UserRole.admin,
        firstName: '健太',
        lastName: '伊藤',
        gender: Gender.male,
        departmentId: systemDept.id,
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
    ],
  });

  console.log(`1 件の System User 作成完了`);
  console.log(`${users.count} 件の User 作成完了`);
}
