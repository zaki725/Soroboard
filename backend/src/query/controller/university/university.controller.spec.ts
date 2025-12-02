import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UniversityQueryModule } from '../../../modules/university/university-query.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { PrismaService } from '../../../prisma.service';

describe('UniversityController (Query) (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, UniversityQueryModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    // テスト前にクリーンアップ
    await prisma.faculty.deleteMany();
    await prisma.universityRank.deleteMany();
    await prisma.university.deleteMany();
  });

  afterEach(async () => {
    // テスト後にクリーンアップ
    try {
      await prisma.faculty.deleteMany();
      await prisma.universityRank.deleteMany();
      await prisma.university.deleteMany();
    } catch {
      // テーブルが存在しない場合は無視
    }
    await app.close();
  });

  describe('GET /universities', () => {
    it('正常系: 大学一覧を取得できる', async () => {
      await prisma.university.create({
        data: {
          name: 'テスト大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.university.create({
        data: {
          name: 'サンプル大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/universities')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('正常系: IDでフィルタリングできる', async () => {
      const university1 = await prisma.university.create({
        data: {
          name: 'テスト大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.university.create({
        data: {
          name: 'サンプル大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/universities?id=${university1.id}`)
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(university1.id);
    });

    it('正常系: 検索キーワードでフィルタリングできる', async () => {
      await prisma.university.create({
        data: {
          name: 'テスト大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.university.create({
        data: {
          name: 'サンプル大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/universities?search=テスト')
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('テスト大学');
    });

    it('正常系: ランクでフィルタリングできる', async () => {
      const university1 = await prisma.university.create({
        data: {
          name: 'テスト大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const university2 = await prisma.university.create({
        data: {
          name: 'サンプル大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.universityRank.create({
        data: {
          universityId: university1.id,
          rank: 'S',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.universityRank.create({
        data: {
          universityId: university2.id,
          rank: 'A',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/universities?rank=S')
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(university1.id);
      expect(response.body[0].rank).toBe('S');
    });

    it('正常系: データがない場合は空配列を返す', async () => {
      const response = await request(app.getHttpServer())
        .get('/universities')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });
});
