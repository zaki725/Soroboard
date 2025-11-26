import { PrismaClient } from '@prisma/client';

/**
 * RecruitYear マスタ作成用 seed
 */
export async function seedRecruitYears({ prisma }: { prisma: PrismaClient }) {
  const environment = process.env.NODE_ENV || 'development';
  if (environment === 'production') {
    throw new Error('本番環境で RecruitYear シードは実行できません。');
  }

  console.log('RecruitYear マスタ作成を開始...');

  const recruitYears = [
    {
      recruitYear: 2027,
      displayName: '27卒',
      themeColor: '#1E88E5',
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      recruitYear: 2028,
      displayName: '28卒',
      themeColor: '#43A047',
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      recruitYear: 2029,
      displayName: '29卒',
      themeColor: '#FB8C00',
      createdBy: 'system',
      updatedBy: 'system',
    },
  ];

  for (const year of recruitYears) {
    await prisma.recruitYear.upsert({
      where: { recruitYear: year.recruitYear },
      update: {
        displayName: year.displayName,
        themeColor: year.themeColor,
        createdBy: year.createdBy,
        updatedBy: year.updatedBy,
      },
      create: year,
    });
  }

  console.log(`${recruitYears.length} 件の RecruitYear 作成完了`);
}
