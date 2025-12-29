import { PrismaClient, StudentStatus } from '@prisma/client';
import { ulid } from 'ulid';

/**
 * Student シード作成用
 */
export async function seedStudents({ prisma }: { prisma: PrismaClient }) {
  const environment = process.env.NODE_ENV || 'development';
  if (environment === 'production') {
    throw new Error('本番環境で Student シードは実行できません。');
  }

  console.log('Student シード作成を開始...');

  // Schoolを取得
  const schools = await prisma.school.findMany({
    where: { isActive: true },
  });

  if (schools.length === 0) {
    throw new Error(
      'Schoolが見つかりません。先にSchoolシードを実行してください。',
    );
  }

  // 既存のデータを削除
  await prisma.student.deleteMany();

  const systemUserId = 'system';

  // シードデータを追加
  const students = [
    {
      id: ulid(),
      schoolId: schools[0].id,
      studentNo: '001',
      firstName: '太郎',
      lastName: '山田',
      firstNameKana: 'タロウ',
      lastNameKana: 'ヤマダ',
      birthDate: new Date('2010-04-15'),
      status: StudentStatus.ACTIVE,
      joinedAt: new Date('2023-04-01T00:00:00Z'),
      leftAt: null,
      note: null,
      createdBy: systemUserId,
      updatedBy: systemUserId,
    },
    {
      id: ulid(),
      schoolId: schools[0].id,
      studentNo: '002',
      firstName: '花子',
      lastName: '佐藤',
      firstNameKana: 'ハナコ',
      lastNameKana: 'サトウ',
      birthDate: new Date('2011-06-20'),
      status: StudentStatus.ACTIVE,
      joinedAt: new Date('2023-04-01T00:00:00Z'),
      leftAt: null,
      note: '集中力が高い',
      createdBy: systemUserId,
      updatedBy: systemUserId,
    },
    {
      id: ulid(),
      schoolId: schools[0].id,
      studentNo: '003',
      firstName: '一郎',
      lastName: '鈴木',
      firstNameKana: 'イチロウ',
      lastNameKana: 'スズキ',
      birthDate: new Date('2012-08-10'),
      status: StudentStatus.ACTIVE,
      joinedAt: new Date('2023-09-01T00:00:00Z'),
      leftAt: null,
      note: null,
      createdBy: systemUserId,
      updatedBy: systemUserId,
    },
    {
      id: ulid(),
      schoolId: schools[1]?.id || schools[0].id,
      studentNo: '101',
      firstName: 'みどり',
      lastName: '高橋',
      firstNameKana: 'ミドリ',
      lastNameKana: 'タカハシ',
      birthDate: new Date('2010-03-05'),
      status: StudentStatus.SUSPENDED,
      joinedAt: new Date('2022-04-01T00:00:00Z'),
      leftAt: null,
      note: '一時休会中',
      createdBy: systemUserId,
      updatedBy: systemUserId,
    },
    {
      id: ulid(),
      schoolId: schools[1]?.id || schools[0].id,
      studentNo: '102',
      firstName: '健太',
      lastName: '伊藤',
      firstNameKana: 'ケンタ',
      lastNameKana: 'イトウ',
      birthDate: new Date('2009-11-25'),
      status: StudentStatus.WITHDRAWN,
      joinedAt: new Date('2021-04-01T00:00:00Z'),
      leftAt: new Date('2023-03-31T00:00:00Z'),
      note: '進学のため退会',
      createdBy: systemUserId,
      updatedBy: systemUserId,
    },
  ];

  const result = await prisma.student.createMany({
    data: students,
  });

  console.log(`${result.count} 件の Student 作成完了`);
}

