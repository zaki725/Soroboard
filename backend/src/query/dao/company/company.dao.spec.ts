import { Test, TestingModule } from '@nestjs/testing';
import { CompanyDao } from './company.dao';
import { PrismaService } from '../../../prisma.service';
import { RecruitYear } from '@prisma/client';

describe('CompanyDao', () => {
  let dao: CompanyDao;
  let prisma: PrismaService;
  let recruitYear: RecruitYear;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyDao, PrismaService],
    }).compile();

    dao = module.get<CompanyDao>(CompanyDao);
    prisma = module.get<PrismaService>(PrismaService);

    recruitYear = await prisma.recruitYear.create({
      data: {
        recruitYear: 2024,
        displayName: '2024年度',
        themeColor: '#000000',
        createdBy: 'system',
        updatedBy: 'system',
      },
    });
  });

  afterEach(async () => {
    // テーブルが存在しない場合はエラーを無視
    try {
      await prisma.company.deleteMany();
      await prisma.recruitYear.deleteMany();
    } catch {
      // テーブルが存在しない場合は無視
    }
  });

  describe('findAll', () => {
    it('正常系: 会社一覧を取得できる', async () => {
      const company1 = await prisma.company.create({
        data: {
          name: 'テスト株式会社1',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const company2 = await prisma.company.create({
        data: {
          name: 'テスト株式会社2',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const result = await dao.findAll({
        recruitYearId: recruitYear.recruitYear,
      });

      expect(result).toHaveLength(2);
      expect(result.map((c) => c.id)).toContain(company1.id);
      expect(result.map((c) => c.id)).toContain(company2.id);
    });

    it('正常系: 年度IDでフィルタリングできる', async () => {
      const recruitYear2 = await prisma.recruitYear.create({
        data: {
          recruitYear: 2025,
          displayName: '2025年度',
          themeColor: '#000000',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.company.create({
        data: {
          name: '2024年度の会社',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.company.create({
        data: {
          name: '2025年度の会社',
          recruitYearId: recruitYear2.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const result = await dao.findAll({
        recruitYearId: recruitYear.recruitYear,
      });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('2024年度の会社');
    });

    it('正常系: IDでフィルタリングできる', async () => {
      const company1 = await prisma.company.create({
        data: {
          name: 'テスト株式会社1',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.company.create({
        data: {
          name: 'テスト株式会社2',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const result = await dao.findAll({
        recruitYearId: recruitYear.recruitYear,
        ids: [company1.id],
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(company1.id);
    });

    it('正常系: 検索キーワードで名前をフィルタリングできる', async () => {
      await prisma.company.create({
        data: {
          name: 'テスト株式会社',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.company.create({
        data: {
          name: 'サンプル株式会社',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const result = await dao.findAll({
        recruitYearId: recruitYear.recruitYear,
        search: 'テスト',
      });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('テスト株式会社');
    });

    it('正常系: 検索キーワードでメールアドレスをフィルタリングできる', async () => {
      await prisma.company.create({
        data: {
          name: 'テスト株式会社',
          email: 'test@example.com',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.company.create({
        data: {
          name: 'サンプル株式会社',
          email: 'sample@example.com',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const result = await dao.findAll({
        recruitYearId: recruitYear.recruitYear,
        search: 'test@example.com',
      });

      expect(result).toHaveLength(1);
      expect(result[0].email).toBe('test@example.com');
    });

    it('正常系: 検索キーワードで電話番号をフィルタリングできる', async () => {
      await prisma.company.create({
        data: {
          name: 'テスト株式会社',
          phoneNumber: '03-1234-5678',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.company.create({
        data: {
          name: 'サンプル株式会社',
          phoneNumber: '03-9876-5432',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const result = await dao.findAll({
        recruitYearId: recruitYear.recruitYear,
        search: '1234',
      });

      expect(result).toHaveLength(1);
      expect(result[0].phoneNumber).toBe('03-1234-5678');
    });

    it('正常系: 検索キーワードでWEBサイトURLをフィルタリングできる', async () => {
      await prisma.company.create({
        data: {
          name: 'テスト株式会社',
          websiteUrl: 'https://test.com',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.company.create({
        data: {
          name: 'サンプル株式会社',
          websiteUrl: 'https://sample.com',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const result = await dao.findAll({
        recruitYearId: recruitYear.recruitYear,
        search: 'test.com',
      });

      expect(result).toHaveLength(1);
      expect(result[0].websiteUrl).toBe('https://test.com');
    });

    it('正常系: 登録日時が新しい順でソートされる', async () => {
      const baseDate = new Date('2024-01-01T00:00:00Z');

      await prisma.company.create({
        data: {
          name: 'さ行株式会社',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
          createdAt: new Date(baseDate.getTime() + 1000),
          updatedAt: new Date(baseDate.getTime() + 1000),
        },
      });

      await prisma.company.create({
        data: {
          name: 'あ行株式会社',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
          createdAt: new Date(baseDate.getTime() + 2000),
          updatedAt: new Date(baseDate.getTime() + 2000),
        },
      });

      await prisma.company.create({
        data: {
          name: 'か行株式会社',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
          createdAt: new Date(baseDate.getTime() + 3000),
          updatedAt: new Date(baseDate.getTime() + 3000),
        },
      });

      const result = await dao.findAll({
        recruitYearId: recruitYear.recruitYear,
      });

      expect(result).toHaveLength(3);
      // 新しい順（最後に作成されたものが最初）
      expect(result[0].name).toBe('か行株式会社');
      expect(result[1].name).toBe('あ行株式会社');
      expect(result[2].name).toBe('さ行株式会社');
    });

    it('正常系: 複数の条件を組み合わせてフィルタリングできる', async () => {
      const company1 = await prisma.company.create({
        data: {
          name: 'テスト株式会社',
          email: 'test@example.com',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.company.create({
        data: {
          name: 'テスト株式会社2',
          email: 'test2@example.com',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const result = await dao.findAll({
        recruitYearId: recruitYear.recruitYear,
        ids: [company1.id],
        search: 'テスト',
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(company1.id);
    });
  });

  describe('findOne', () => {
    it('正常系: 会社を1件取得できる', async () => {
      const company = await prisma.company.create({
        data: {
          name: 'テスト株式会社',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const result = await dao.findOne({ id: company.id });

      expect(result).toBeDefined();
      expect(result?.id).toBe(company.id);
      expect(result?.name).toBe(company.name);
    });

    it('正常系: 存在しないIDの場合はnullを返す', async () => {
      const result = await dao.findOne({ id: 'non-existent-id' });

      expect(result).toBeNull();
    });
  });
});
