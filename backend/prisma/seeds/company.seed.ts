import { PrismaClient } from '@prisma/client';

/**
 * Company シード作成用
 */
export async function seedCompanies({ prisma }: { prisma: PrismaClient }) {
  console.log('Company シード作成を開始...');

  // 年度データを取得（既に作成されている前提）
  const recruitYears = await prisma.recruitYear.findMany({
    orderBy: { recruitYear: 'desc' },
  });

  if (recruitYears.length === 0) {
    console.log('年度データが存在しないため、Company シードをスキップします。');
    return;
  }

  // すべての年度にレバレジーズ株式会社を追加
  let createdCount = 0;
  let skippedCount = 0;

  for (const year of recruitYears) {
    const existing = await prisma.company.findFirst({
      where: {
        name: 'レバレジーズ株式会社',
        recruitYearId: year.recruitYear,
      },
    });

    if (existing) {
      skippedCount++;
      continue;
    }

    try {
      await prisma.company.create({
        data: {
          name: 'レバレジーズ株式会社',
          phoneNumber: '0120-999-999',
          email: 'info@leverages.jp',
          websiteUrl: 'https://leverages.jp/',
          recruitYearId: year.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });
      createdCount++;
    } catch (error) {
      // ユニーク制約違反の場合はスキップ、それ以外はログ出力
      if (
        error instanceof Error &&
        error.message.includes('Unique constraint')
      ) {
        skippedCount++;
      } else {
        console.warn(
          `Company シード作成エラー (年度: ${year.recruitYear}):`,
          error instanceof Error ? error.message : error,
        );
        skippedCount++;
      }
    }
  }

  if (createdCount > 0) {
    console.log(
      `${createdCount} 件の Company 作成完了（レバレジーズ株式会社）`,
    );
  }
  if (skippedCount > 0) {
    console.log(
      `${skippedCount} 件の Company は既に存在します（レバレジーズ株式会社）`,
    );
  }
}
