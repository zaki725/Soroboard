import { PrismaClient } from '@prisma/client';

/**
 * School マスタ作成用 seed
 */
export async function seedSchools({ prisma }: { prisma: PrismaClient }) {
  const environment = process.env.NODE_ENV || 'development';
  if (environment === 'production') {
    throw new Error('本番環境で School シードは実行できません。');
  }

  console.log('School マスタ作成を開始...');

  const schools = [
    {
      name: '田中そろばん教室',
      isActive: true,
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      name: '佐藤そろばん教室',
      isActive: true,
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      name: '伊藤そろばん教室',
      isActive: true,
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      name: '山本そろばん教室',
      isActive: true,
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      name: '松本そろばん教室',
      isActive: false,
      createdBy: 'system',
      updatedBy: 'system',
    },
  ];

  for (const school of schools) {
    await prisma.school.upsert({
      where: { name: school.name },
      update: {
        isActive: school.isActive,
        updatedBy: school.updatedBy,
      },
      create: school,
    });
  }

  console.log(`${schools.length} 件の School 作成完了`);
}

