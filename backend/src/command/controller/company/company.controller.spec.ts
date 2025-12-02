import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CompanyCommandModule } from '../../../modules/company/company-command.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { LoggerModule } from '../../../config/logger.module';
import { PrismaService } from '../../../prisma.service';
import { CompanyResponseDto } from '../../../query/dto/company/company.dto';

describe('CompanyController (Command) (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, LoggerModule, CompanyCommandModule],
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
    if (app) {
      await app.close();
    }
  });

  describe('POST /companies', () => {
    it('正常系: 会社を作成できる', async () => {
      const recruitYear = await prisma.recruitYear.create({
        data: {
          recruitYear: 2024,
          displayName: '2024年度',
          themeColor: '#000000',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const createData = {
        name: 'テスト株式会社',
        phoneNumber: '03-1234-5678',
        email: 'test@example.com',
        websiteUrl: 'https://example.com',
        recruitYearId: recruitYear.recruitYear,
      };

      const response = await request(app.getHttpServer())
        .post('/companies')
        .send(createData)
        .expect(201);

      const body = response.body as CompanyResponseDto;
      expect(body).toMatchObject({
        name: createData.name,
        phoneNumber: createData.phoneNumber,
        email: createData.email,
        websiteUrl: createData.websiteUrl,
        recruitYearId: createData.recruitYearId,
      });
      expect(body.id).toBeDefined();

      const created = await prisma.company.findUnique({
        where: { id: body.id },
      });
      expect(created).toBeDefined();
    });

    it('異常系: 必須項目が不足している場合は400エラー', async () => {
      const recruitYear = await prisma.recruitYear.create({
        data: {
          recruitYear: 2024,
          displayName: '2024年度',
          themeColor: '#000000',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await request(app.getHttpServer())
        .post('/companies')
        .send({
          phoneNumber: '03-1234-5678',
          recruitYearId: recruitYear.recruitYear,
        })
        .expect(400);
    });

    it('異常系: メールアドレスの形式が不正な場合は400エラー', async () => {
      const recruitYear = await prisma.recruitYear.create({
        data: {
          recruitYear: 2024,
          displayName: '2024年度',
          themeColor: '#000000',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await request(app.getHttpServer())
        .post('/companies')
        .send({
          name: 'テスト株式会社',
          email: 'invalid-email',
          recruitYearId: recruitYear.recruitYear,
        })
        .expect(400);
    });

    it('正常系: オプショナル項目がnullの場合は作成できる', async () => {
      const recruitYear = await prisma.recruitYear.create({
        data: {
          recruitYear: 2024,
          displayName: '2024年度',
          themeColor: '#000000',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const createData = {
        name: 'テスト株式会社',
        phoneNumber: null,
        email: null,
        websiteUrl: null,
        recruitYearId: recruitYear.recruitYear,
      };

      const response = await request(app.getHttpServer())
        .post('/companies')
        .send(createData)
        .expect(201);

      const body = response.body as CompanyResponseDto;
      expect(body).toMatchObject({
        name: createData.name,
        phoneNumber: null,
        email: null,
        websiteUrl: null,
        recruitYearId: createData.recruitYearId,
      });
    });
  });

  describe('PUT /companies', () => {
    it('正常系: 会社を更新できる', async () => {
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
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const updateData = {
        id: company.id,
        name: '更新テスト株式会社',
        phoneNumber: '03-9876-5432',
        email: 'updated@example.com',
        websiteUrl: 'https://updated.com',
        recruitYearId: recruitYear.recruitYear,
      };

      const response = await request(app.getHttpServer())
        .put('/companies')
        .send(updateData)
        .expect(200);

      const body = response.body as CompanyResponseDto;
      expect(body).toMatchObject({
        id: company.id,
        name: updateData.name,
        phoneNumber: updateData.phoneNumber,
        email: updateData.email,
        websiteUrl: updateData.websiteUrl,
        recruitYearId: updateData.recruitYearId,
      });

      const updated = await prisma.company.findUnique({
        where: { id: company.id },
      });
      expect(updated?.name).toBe(updateData.name);
    });

    it('異常系: IDが不足している場合は400エラー', async () => {
      const recruitYear = await prisma.recruitYear.create({
        data: {
          recruitYear: 2024,
          displayName: '2024年度',
          themeColor: '#000000',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await request(app.getHttpServer())
        .put('/companies')
        .send({
          name: 'テスト株式会社',
          recruitYearId: recruitYear.recruitYear,
        })
        .expect(400);
    });

    it('異常系: 存在しないIDの場合は404エラー', async () => {
      const recruitYear = await prisma.recruitYear.create({
        data: {
          recruitYear: 2024,
          displayName: '2024年度',
          themeColor: '#000000',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await request(app.getHttpServer())
        .put('/companies')
        .send({
          id: 'non-existent-id',
          name: 'テスト株式会社',
          recruitYearId: recruitYear.recruitYear,
        })
        .expect(404);
    });
  });
});
