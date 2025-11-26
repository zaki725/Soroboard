import { PrismaClient } from '@prisma/client';

/**
 * Faculty マスタ作成用 seed
 */
export async function seedFaculties({ prisma }: { prisma: PrismaClient }) {
  const environment = process.env.NODE_ENV || 'development';
  if (environment === 'production') {
    throw new Error('本番環境で Faculty シードは実行できません。');
  }

  console.log('Faculty マスタ作成を開始...');

  // 大学を取得
  const universities = await prisma.university.findMany();
  const universityMap = new Map(universities.map((u) => [u.name, u.id]));

  const faculties = [
    {
      universityName: '東京大学',
      name: '工学部',
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      universityName: '東京大学',
      name: '理学部',
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      universityName: '京都大学',
      name: '工学部',
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      universityName: '京都大学',
      name: '理学部',
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      universityName: '大阪大学',
      name: '工学部',
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      universityName: '名古屋大学',
      name: '工学部',
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      universityName: '東北大学',
      name: '工学部',
      createdBy: 'system',
      updatedBy: 'system',
    },
  ];

  for (const faculty of faculties) {
    const universityId = universityMap.get(faculty.universityName);
    if (!universityId) {
      console.warn(
        `大学 "${faculty.universityName}" が見つかりません。スキップします。`,
      );
      continue;
    }

    await prisma.faculty.upsert({
      where: {
        name_universityId: {
          name: faculty.name,
          universityId: universityId,
        },
      },
      update: {
        updatedBy: faculty.updatedBy,
      },
      create: {
        name: faculty.name,
        universityId: universityId,
        createdBy: faculty.createdBy,
        updatedBy: faculty.updatedBy,
      },
    });
  }

  console.log(`${faculties.length} 件の Faculty 作成完了`);
}
