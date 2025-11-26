import { PrismaClient } from '@prisma/client';

/**
 * DeviationValue マスタ作成用 seed
 */
export async function seedDeviationValues({
  prisma,
}: {
  prisma: PrismaClient;
}) {
  const environment = process.env.NODE_ENV || 'development';
  if (environment === 'production') {
    throw new Error('本番環境で DeviationValue シードは実行できません。');
  }

  console.log('DeviationValue マスタ作成を開始...');

  // 学部を取得
  const faculties = await prisma.faculty.findMany({
    include: {
      university: true,
    },
  });

  const facultyMap = new Map<string, string>();
  for (const faculty of faculties) {
    const key = `${faculty.university.name}_${faculty.name}`;
    facultyMap.set(key, faculty.id);
  }

  const deviationValues = [
    {
      universityName: '東京大学',
      facultyName: '工学部',
      value: 72.5,
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      universityName: '東京大学',
      facultyName: '理学部',
      value: 70.0,
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      universityName: '京都大学',
      facultyName: '工学部',
      value: 70.5,
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      universityName: '京都大学',
      facultyName: '理学部',
      value: 68.5,
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      universityName: '大阪大学',
      facultyName: '工学部',
      value: 65.0,
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      universityName: '名古屋大学',
      facultyName: '工学部',
      value: 62.5,
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      universityName: '東北大学',
      facultyName: '工学部',
      value: 60.0,
      createdBy: 'system',
      updatedBy: 'system',
    },
  ];

  for (const dv of deviationValues) {
    const key = `${dv.universityName}_${dv.facultyName}`;
    const facultyId = facultyMap.get(key);
    if (!facultyId) {
      console.warn(
        `学部 "${dv.universityName} ${dv.facultyName}" が見つかりません。スキップします。`,
      );
      continue;
    }

    // 既存の偏差値がある場合は更新、なければ作成
    const existing = await prisma.deviationValue.findFirst({
      where: { facultyId },
    });

    if (existing) {
      await prisma.deviationValue.update({
        where: { id: existing.id },
        data: {
          value: dv.value,
          updatedBy: dv.updatedBy,
        },
      });
    } else {
      await prisma.deviationValue.create({
        data: {
          facultyId: facultyId,
          value: dv.value,
          createdBy: dv.createdBy,
          updatedBy: dv.updatedBy,
        },
      });
    }
  }

  console.log(`${deviationValues.length} 件の DeviationValue 作成完了`);
}
