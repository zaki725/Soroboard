import { PrismaClient } from '@prisma/client';

/**
 * JobCategory マスタ作成用 seed
 */
export async function seedJobCategories({ prisma }: { prisma: PrismaClient }) {
  const environment = process.env.NODE_ENV || 'development';
  if (environment === 'production') {
    throw new Error('本番環境で JobCategory シードは実行できません。');
  }

  console.log('JobCategory マスタ作成を開始...');

  const jobCategories = [
    {
      name: 'エンジニア',
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      name: 'マーケティング',
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      name: '営業',
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      name: '共通',
      createdBy: 'system',
      updatedBy: 'system',
    },
  ];

  // 職種を作成（年度に関係なく共通）
  for (const jobCategory of jobCategories) {
    await prisma.jobCategory.upsert({
      where: {
        name: jobCategory.name,
      },
      update: {
        updatedBy: jobCategory.updatedBy,
      },
      create: jobCategory,
    });
  }

  console.log(`${jobCategories.length} 件の JobCategory 作成完了`);
}
