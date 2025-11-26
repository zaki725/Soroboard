import { PrismaClient } from '@prisma/client';

/**
 * Department マスタ作成用 seed
 */
export async function seedDepartments({ prisma }: { prisma: PrismaClient }) {
  const environment = process.env.NODE_ENV || 'development';
  if (environment === 'production') {
    throw new Error('本番環境で Department シードは実行できません。');
  }

  console.log('Department マスタ作成を開始...');

  const departments = [
    {
      name: 'システム本部',
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      name: '人事部',
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      name: '営業部',
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      name: 'マーケティング部',
      createdBy: 'system',
      updatedBy: 'system',
    },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { name: dept.name },
      update: {
        updatedBy: dept.updatedBy,
      },
      create: dept,
    });
  }

  console.log(`${departments.length} 件の Department 作成完了`);
}
