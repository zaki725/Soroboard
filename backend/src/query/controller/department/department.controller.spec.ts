import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DepartmentQueryModule } from '../../../modules/department/department-query.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { PrismaService } from '../../../prisma.service';

describe('DepartmentController (Query) (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, DepartmentQueryModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    // テスト前にクリーンアップ
    await prisma.user.deleteMany();
    await prisma.department.deleteMany();
  });

  afterEach(async () => {
    // テスト後にクリーンアップ
    try {
      await prisma.user.deleteMany();
      await prisma.department.deleteMany();
    } catch {
      // テーブルが存在しない場合は無視
    }
    await app.close();
  });

  describe('GET /departments', () => {
    it('正常系: 部署一覧を取得できる', async () => {
      await prisma.department.create({
        data: {
          name: '開発部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.department.create({
        data: {
          name: '営業部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/departments')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('正常系: IDでフィルタリングできる', async () => {
      const department1 = await prisma.department.create({
        data: {
          name: '開発部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.department.create({
        data: {
          name: '営業部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/departments?id=${department1.id}`)
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(department1.id);
    });

    it('正常系: 検索キーワードでフィルタリングできる', async () => {
      await prisma.department.create({
        data: {
          name: '開発部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.department.create({
        data: {
          name: '営業部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/departments?search=開発')
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('開発部');
    });

    it('正常系: データがない場合は空配列を返す', async () => {
      const response = await request(app.getHttpServer())
        .get('/departments')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });
});
