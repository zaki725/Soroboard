import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { RecruitYearQueryModule } from '../../../modules/recruit-year/recruit-year-query.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { PrismaService } from '../../../prisma.service';

describe('RecruitYearController (Query) (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, RecruitYearQueryModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    // テスト前にクリーンアップ
    await prisma.company.deleteMany();
    await prisma.recruitYear.deleteMany();
  });

  afterEach(async () => {
    // テスト後にクリーンアップ
    try {
      await prisma.company.deleteMany();
      await prisma.recruitYear.deleteMany();
    } catch {
      // テーブルが存在しない場合は無視
    }
    await app.close();
  });

  describe('GET /recruit-years', () => {
    it('正常系: 年度一覧を取得できる', async () => {
      await prisma.recruitYear.create({
        data: {
          recruitYear: 2024,
          displayName: '2024年度',
          themeColor: '#000000',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.recruitYear.create({
        data: {
          recruitYear: 2025,
          displayName: '2025年度',
          themeColor: '#FF0000',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/recruit-years')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            recruitYear: 2024,
            displayName: '2024年度',
          }),
          expect.objectContaining({
            recruitYear: 2025,
            displayName: '2025年度',
          }),
        ]),
      );
    });

    it('正常系: データがない場合は空配列を返す', async () => {
      const response = await request(app.getHttpServer())
        .get('/recruit-years')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('正常系: 年度順にソートされる', async () => {
      await prisma.recruitYear.create({
        data: {
          recruitYear: 2025,
          displayName: '2025年度',
          themeColor: '#000000',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.recruitYear.create({
        data: {
          recruitYear: 2024,
          displayName: '2024年度',
          themeColor: '#000000',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.recruitYear.create({
        data: {
          recruitYear: 2026,
          displayName: '2026年度',
          themeColor: '#000000',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/recruit-years')
        .expect(200);

      expect(response.body.length).toBeGreaterThanOrEqual(3);
      const years = response.body.map(
        (r: { recruitYear: number }) => r.recruitYear,
      );
      expect(years).toEqual([...years].sort((a, b) => b - a));
    });
  });
});
