import { PrismaClient } from '@prisma/client';

/**
 * EventLocation マスタ作成用 seed
 * 47都道府県と海外の計48個
 */
export async function seedLocations({ prisma }: { prisma: PrismaClient }) {
  const environment = process.env.NODE_ENV || 'development';
  if (environment === 'production') {
    throw new Error('本番環境で Location シードは実行できません。');
  }

  console.log('EventLocation マスタ作成を開始...');

  const locations = [
    // 北海道・東北地方
    { name: '北海道' },
    { name: '青森県' },
    { name: '岩手県' },
    { name: '宮城県' },
    { name: '秋田県' },
    { name: '山形県' },
    { name: '福島県' },
    // 関東地方
    { name: '茨城県' },
    { name: '栃木県' },
    { name: '群馬県' },
    { name: '埼玉県' },
    { name: '千葉県' },
    { name: '東京都' },
    { name: '神奈川県' },
    // 中部地方
    { name: '新潟県' },
    { name: '富山県' },
    { name: '石川県' },
    { name: '福井県' },
    { name: '山梨県' },
    { name: '長野県' },
    { name: '岐阜県' },
    { name: '静岡県' },
    { name: '愛知県' },
    // 近畿地方
    { name: '三重県' },
    { name: '滋賀県' },
    { name: '京都府' },
    { name: '大阪府' },
    { name: '兵庫県' },
    { name: '奈良県' },
    { name: '和歌山県' },
    // 中国地方
    { name: '鳥取県' },
    { name: '島根県' },
    { name: '岡山県' },
    { name: '広島県' },
    { name: '山口県' },
    // 四国地方
    { name: '徳島県' },
    { name: '香川県' },
    { name: '愛媛県' },
    { name: '高知県' },
    // 九州地方
    { name: '福岡県' },
    { name: '佐賀県' },
    { name: '長崎県' },
    { name: '熊本県' },
    { name: '大分県' },
    { name: '宮崎県' },
    { name: '鹿児島県' },
    { name: '沖縄県' },
    // 海外
    { name: '海外' },
  ];

  for (const location of locations) {
    await prisma.eventLocation.upsert({
      where: { name: location.name },
      update: {
        updatedBy: 'system',
      },
      create: {
        name: location.name,
        createdBy: 'system',
        updatedBy: 'system',
      },
    });
  }

  console.log(`${locations.length} 件の EventLocation 作成完了`);
}
