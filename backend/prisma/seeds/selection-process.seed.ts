import {
  PrismaClient,
  SelectionStage,
  SelectionPeriod,
  SelectionType,
} from '@prisma/client';

/**
 * SelectionProcess マスタ作成用 seed
 */
export async function seedSelectionProcesses({
  prisma,
}: {
  prisma: PrismaClient;
}) {
  const environment = process.env.NODE_ENV || 'development';
  if (environment === 'production') {
    throw new Error('本番環境で SelectionProcess シードは実行できません。');
  }

  console.log('SelectionProcess マスタ作成を開始...');

  // 年度ごとの選考プロセス
  const selectionProcesses = [
    // 2027卒
    {
      stage: SelectionStage.FIRST,
      order: 1,
      recruitYearId: 2027,
      selectionPeriod: SelectionPeriod.MAIN,
      selectionType: SelectionType.INTERVIEW,
      jobCategoryId: 'placeholder', // Will be replaced
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      stage: SelectionStage.SECOND,
      order: 2,
      recruitYearId: 2027,
      selectionPeriod: SelectionPeriod.MAIN,
      selectionType: SelectionType.INTERVIEW,
      jobCategoryId: 'placeholder', // Will be replaced
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      stage: SelectionStage.FINAL,
      order: 3,
      recruitYearId: 2027,
      selectionPeriod: SelectionPeriod.MAIN,
      selectionType: SelectionType.INTERVIEW,
      jobCategoryId: 'placeholder', // Will be replaced
      createdBy: 'system',
      updatedBy: 'system',
    },
    // 2028卒
    {
      stage: SelectionStage.FIRST,
      order: 1,
      recruitYearId: 2028,
      selectionPeriod: SelectionPeriod.MAIN,
      selectionType: SelectionType.INTERVIEW,
      jobCategoryId: 'placeholder', // Will be replaced
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      stage: SelectionStage.FIRST,
      order: 2,
      recruitYearId: 2028,
      selectionPeriod: SelectionPeriod.MAIN,
      selectionType: SelectionType.INTERVIEW_DISCUSSION,
      jobCategoryId: 'placeholder', // Will be replaced
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      stage: SelectionStage.SECOND,
      order: 3,
      recruitYearId: 2028,
      selectionPeriod: SelectionPeriod.MAIN,
      selectionType: SelectionType.INTERVIEW,
      jobCategoryId: 'placeholder', // Will be replaced
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      stage: SelectionStage.FINAL,
      order: 4,
      recruitYearId: 2028,
      selectionPeriod: SelectionPeriod.MAIN,
      selectionType: SelectionType.INTERVIEW,
      jobCategoryId: 'placeholder', // Will be replaced
      createdBy: 'system',
      updatedBy: 'system',
    },
    // 2029卒
    {
      stage: SelectionStage.FIRST,
      order: 1,
      recruitYearId: 2029,
      selectionPeriod: SelectionPeriod.MAIN,
      selectionType: SelectionType.INTERVIEW,
      jobCategoryId: 'placeholder', // Will be replaced
      createdBy: 'system',
      updatedBy: 'system',
    },
    {
      stage: SelectionStage.FINAL,
      order: 2,
      recruitYearId: 2029,
      selectionPeriod: SelectionPeriod.MAIN,
      selectionType: SelectionType.INTERVIEW,
      jobCategoryId: 'placeholder', // Will be replaced
      createdBy: 'system',
      updatedBy: 'system',
    },
  ];

  // JobCategory '共通'を一度だけ取得
  const jobCategory = await prisma.jobCategory.findUnique({
    where: {
      name: '共通', // Assuming '共通' is the default job category for these seeds
    },
  });

  if (!jobCategory) {
    throw new Error(
      `JobCategory '共通' not found. 先に JobCategory のシードを実行してください。`,
    );
  }

  // 各選考プロセスにjobCategoryIdを設定
  for (const process of selectionProcesses) {
    process.jobCategoryId = jobCategory.id;

    // 複合ユニーク制約を使用（recruitYearId_stage_period_type_category）
    await prisma.selectionProcess.upsert({
      where: {
        recruitYearId_stage_period_type_category: {
          recruitYearId: process.recruitYearId,
          stage: process.stage,
          selectionPeriod: process.selectionPeriod,
          selectionType: process.selectionType,
          jobCategoryId: process.jobCategoryId,
        },
      },
      update: {
        order: process.order,
        updatedBy: process.updatedBy,
      },
      create: process,
    });
  }

  console.log(`${selectionProcesses.length} 件の SelectionProcess 作成完了`);
}
