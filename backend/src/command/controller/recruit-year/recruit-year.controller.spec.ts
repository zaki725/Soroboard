import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { RecruitYearCommandModule } from '../../../modules/recruit-year/recruit-year-command.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { LoggerModule } from '../../../config/logger.module';
import { PrismaService } from '../../../prisma.service';
import { RecruitYearResponseDto } from '../../../query/dto/recruit-year/recruit-year.dto';

describe('RecruitYearController (Command) (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, LoggerModule, RecruitYearCommandModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    // テスト前にクリーンアップ
    await prisma.company.deleteMany();
    await prisma.selectionProcess.deleteMany();
    await prisma.recruitYear.deleteMany();
  });

  afterEach(async () => {
    // テスト後にクリーンアップ
    try {
      await prisma.company.deleteMany();
      await prisma.selectionProcess.deleteMany();
      await prisma.recruitYear.deleteMany();
    } catch {
      // テーブルが存在しない場合は無視
    }
    if (app) {
      await app.close();
    }
  });

  describe('POST /recruit-years', () => {
    it('正常系: 年度を作成できる', async () => {
      const createData = {
        recruitYear: 2024,
        displayName: '2024年度',
        themeColor: '#000000',
      };

      const response = await request(app.getHttpServer())
        .post('/recruit-years')
        .send(createData)
        .expect(201);

      const body = response.body as RecruitYearResponseDto;
      expect(body).toMatchObject({
        recruitYear: createData.recruitYear,
        displayName: createData.displayName,
        themeColor: createData.themeColor,
      });

      const created = await prisma.recruitYear.findUnique({
        where: { recruitYear: createData.recruitYear },
      });
      expect(created).toBeDefined();
      expect(created?.displayName).toBe(createData.displayName);
    });

    it('異常系: 必須項目が不足している場合は400エラー', async () => {
      await request(app.getHttpServer())
        .post('/recruit-years')
        .send({
          recruitYear: 2024,
        })
        .expect(400);
    });

    it('異常系: 年度が不正な場合は400エラー', async () => {
      await request(app.getHttpServer())
        .post('/recruit-years')
        .send({
          recruitYear: 'invalid',
          displayName: '2024年度',
          themeColor: '#000000',
        })
        .expect(400);
    });

    it('正常系: 同じ年度で作成してもupsertされる', async () => {
      const createData = {
        recruitYear: 2024,
        displayName: '2024年度',
        themeColor: '#000000',
      };

      await request(app.getHttpServer())
        .post('/recruit-years')
        .send(createData)
        .expect(201);

      const updateData = {
        recruitYear: 2024,
        displayName: '2024年度（更新）',
        themeColor: '#FF0000',
      };

      const response = await request(app.getHttpServer())
        .post('/recruit-years')
        .send(updateData)
        .expect(201);

      const body = response.body as RecruitYearResponseDto;
      expect(body).toMatchObject({
        recruitYear: updateData.recruitYear,
        displayName: updateData.displayName,
        themeColor: updateData.themeColor,
      });
    });
  });

  describe('PUT /recruit-years', () => {
    it('正常系: 年度を更新できる', async () => {
      const recruitYear = await prisma.recruitYear.create({
        data: {
          recruitYear: 2024,
          displayName: '2024年度',
          themeColor: '#000000',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const updateData = {
        recruitYear: recruitYear.recruitYear,
        displayName: '2024年度（更新）',
        themeColor: '#FF0000',
      };

      const response = await request(app.getHttpServer())
        .put('/recruit-years')
        .send(updateData)
        .expect(200);

      const body = response.body as RecruitYearResponseDto;
      expect(body).toMatchObject({
        recruitYear: updateData.recruitYear,
        displayName: updateData.displayName,
        themeColor: updateData.themeColor,
      });

      const updated = await prisma.recruitYear.findUnique({
        where: { recruitYear: recruitYear.recruitYear },
      });
      expect(updated?.displayName).toBe(updateData.displayName);
      expect(updated?.themeColor).toBe(updateData.themeColor);
      // 監査フィールドの存在を確認（データベースレコード）
      expect(updated?.createdBy).toBe('system');
    });

    it('異常系: 必須項目が不足している場合は400エラー', async () => {
      await request(app.getHttpServer())
        .put('/recruit-years')
        .send({
          recruitYear: 2024,
        })
        .expect(400);
    });

    it('正常系: 存在しない年度でもupsertされる', async () => {
      const updateData = {
        recruitYear: 2025,
        displayName: '2025年度',
        themeColor: '#000000',
      };

      const response = await request(app.getHttpServer())
        .put('/recruit-years')
        .send(updateData)
        .expect(200);

      const body = response.body as RecruitYearResponseDto;
      expect(body).toMatchObject({
        recruitYear: updateData.recruitYear,
        displayName: updateData.displayName,
        themeColor: updateData.themeColor,
      });
    });
  });
});
