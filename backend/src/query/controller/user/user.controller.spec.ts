import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserQueryModule } from '../../../modules/user/user-query.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { PrismaService } from '../../../prisma.service';

describe('UserController (Query) (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, UserQueryModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    // テスト前にクリーンアップ
    await prisma.interviewer.deleteMany();
    await prisma.user.deleteMany();
    await prisma.department.deleteMany();
  });

  afterEach(async () => {
    // テスト後にクリーンアップ
    try {
      await prisma.interviewer.deleteMany();
      await prisma.user.deleteMany();
      await prisma.department.deleteMany();
    } catch {
      // テーブルが存在しない場合は無視
    }
    await app.close();
  });

  describe('GET /users', () => {
    it('正常系: ユーザー一覧を取得できる', async () => {
      const department = await prisma.department.create({
        data: {
          name: '開発部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.user.create({
        data: {
          email: 'test1@example.com',
          firstName: '太郎',
          lastName: '山田',
          role: 'user',
          departmentId: department.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.user.create({
        data: {
          email: 'test2@example.com',
          firstName: '次郎',
          lastName: '佐藤',
          role: 'admin',
          departmentId: department.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body.users).toBeDefined();
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.users.length).toBeGreaterThanOrEqual(2);
      expect(response.body.total).toBeGreaterThanOrEqual(2);
    });

    it('正常系: IDでフィルタリングできる', async () => {
      const department = await prisma.department.create({
        data: {
          name: '開発部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const user1 = await prisma.user.create({
        data: {
          email: 'test1@example.com',
          firstName: '太郎',
          lastName: '山田',
          role: 'user',
          departmentId: department.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.user.create({
        data: {
          email: 'test2@example.com',
          firstName: '次郎',
          lastName: '佐藤',
          role: 'user',
          departmentId: department.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/users?id=${user1.id}`)
        .expect(200);

      expect(response.body.users.length).toBe(1);
      expect(response.body.users[0].id).toBe(user1.id);
    });

    it('正常系: 検索キーワードでフィルタリングできる', async () => {
      const department = await prisma.department.create({
        data: {
          name: '開発部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.user.create({
        data: {
          email: 'test1@example.com',
          firstName: '太郎',
          lastName: '山田',
          role: 'user',
          departmentId: department.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.user.create({
        data: {
          email: 'test2@example.com',
          firstName: '次郎',
          lastName: '佐藤',
          role: 'user',
          departmentId: department.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/users?search=山田')
        .expect(200);

      expect(response.body.users.length).toBe(1);
      expect(response.body.users[0].lastName).toBe('山田');
    });

    it('正常系: ページネーションが機能する', async () => {
      const department = await prisma.department.create({
        data: {
          name: '開発部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      for (let i = 0; i < 5; i++) {
        await prisma.user.create({
          data: {
            email: `test${i}@example.com`,
            firstName: `太郎${i}`,
            lastName: '山田',
            role: 'user',
            departmentId: department.id,
            createdBy: 'system',
            updatedBy: 'system',
          },
        });
      }

      const response = await request(app.getHttpServer())
        .get('/users?page=1&pageSize=2')
        .expect(200);

      expect(response.body.users.length).toBe(2);
      expect(response.body.total).toBeGreaterThanOrEqual(5);
    });
  });

  describe('GET /users/:id', () => {
    it('正常系: ユーザー詳細を取得できる', async () => {
      const department = await prisma.department.create({
        data: {
          name: '開発部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          firstName: '太郎',
          lastName: '山田',
          role: 'user',
          departmentId: department.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        departmentId: department.id,
      });
    });

    it('異常系: 存在しないIDの場合は404エラー', async () => {
      await request(app.getHttpServer())
        .get('/users/non-existent-id')
        .expect(404);
    });
  });

  describe('GET /users/export', () => {
    it('正常系: ユーザー一覧をエクスポート形式で取得できる', async () => {
      const department = await prisma.department.create({
        data: {
          name: '開発部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.user.create({
        data: {
          email: 'test1@example.com',
          firstName: '太郎',
          lastName: '山田',
          role: 'user',
          departmentId: department.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/users/export')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    it('正常系: IDでフィルタリングできる', async () => {
      const department = await prisma.department.create({
        data: {
          name: '開発部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          firstName: '太郎',
          lastName: '山田',
          role: 'user',
          departmentId: department.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/users/export?id=${user.id}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(user.id);
    });
  });
});
