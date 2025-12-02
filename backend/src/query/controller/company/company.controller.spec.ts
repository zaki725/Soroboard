import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CompanyQueryModule } from '../../../modules/company/company-query.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { PrismaService } from '../../../prisma.service';

describe('CompanyController (Query) (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, CompanyQueryModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterEach(async () => {
    // テスト後にクリーンアップ
    // 外部キー制約があるため、依存するテーブル（Company）を先に削除
    // テーブルが存在しない場合はエラーを無視
    try {
      await prisma.company.deleteMany();
      await prisma.recruitYear.deleteMany();
    } catch {
      // テーブルが存在しない場合は無視
    }
    await app.close();
  });

  describe('GET /companies', () => {
    it('正常系: 会社一覧を取得できる', async () => {
      const recruitYear = await prisma.recruitYear.create({
        data: {
          recruitYear: 2024,
          displayName: '2024年度',
          themeColor: '#000000',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const company = await prisma.company.create({
        data: {
          name: 'テスト株式会社',
          phoneNumber: '03-1234-5678',
          email: 'test@example.com',
          websiteUrl: 'https://example.com',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/companies')
        .query({ recruitYearId: recruitYear.recruitYear })
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        id: company.id,
        name: company.name,
        phoneNumber: company.phoneNumber,
        email: company.email,
        websiteUrl: company.websiteUrl,
        recruitYearId: company.recruitYearId,
      });
    });

    it('異常系: 年度IDが不正な場合は400エラー', async () => {
      await request(app.getHttpServer())
        .get('/companies')
        .query({ recruitYearId: 'invalid' })
        .expect(400);
    });

    it('異常系: 年度IDが必須項目として送信されていない場合は400エラー', async () => {
      await request(app.getHttpServer()).get('/companies').expect(400);
    });

    it('正常系: IDでフィルタリングできる', async () => {
      const recruitYear = await prisma.recruitYear.create({
        data: {
          recruitYear: 2024,
          displayName: '2024年度',
          themeColor: '#000000',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

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

      const response = await request(app.getHttpServer())
        .get('/companies')
        .query({
          recruitYearId: recruitYear.recruitYear,
          id: company1.id,
        })
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].id).toBe(company1.id);
    });

    it('正常系: 検索キーワードでフィルタリングできる', async () => {
      const recruitYear = await prisma.recruitYear.create({
        data: {
          recruitYear: 2024,
          displayName: '2024年度',
          themeColor: '#000000',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

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

      const response = await request(app.getHttpServer())
        .get('/companies')
        .query({
          recruitYearId: recruitYear.recruitYear,
          search: 'テスト',
        })
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('テスト株式会社');
    });

    it('正常系: 年度IDが異なる会社は取得されない', async () => {
      const recruitYear1 = await prisma.recruitYear.create({
        data: {
          recruitYear: 2024,
          displayName: '2024年度',
          themeColor: '#000000',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

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
          name: 'テスト株式会社',
          recruitYearId: recruitYear1.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.company.create({
        data: {
          name: 'サンプル株式会社',
          recruitYearId: recruitYear2.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/companies')
        .query({ recruitYearId: recruitYear1.recruitYear })
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('テスト株式会社');
    });
  });
});
