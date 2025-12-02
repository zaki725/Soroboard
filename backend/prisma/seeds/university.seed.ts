import { PrismaClient } from '@prisma/client';

/**
 * University マスタ作成用 seed
 */
export async function seedUniversities({ prisma }: { prisma: PrismaClient }) {
  const environment = process.env.NODE_ENV || 'development';
  if (environment === 'production') {
    throw new Error('本番環境で University シードは実行できません。');
  }

  console.log('University マスタ作成を開始...');

  const universities = [
    {
      name: '東京大学',
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      name: '京都大学',
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      name: '大阪大学',
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      name: '名古屋大学',
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      name: '東北大学',
      createdBy: 'system',
      updatedBy: 'system',
    },
  ];

  for (const university of universities) {
    await prisma.university.upsert({
      where: { name: university.name },
      update: {
        updatedBy: university.updatedBy,
      },
      create: university,
    });
  }

  console.log(`${universities.length} 件の University 作成完了`);
}
