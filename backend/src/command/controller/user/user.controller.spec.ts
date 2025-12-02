import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserCommandModule } from '../../../modules/user/user-command.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { LoggerModule } from '../../../config/logger.module';
import { PrismaService } from '../../../prisma.service';
import { UserResponseDto } from '../../../query/dto/user/user-response.dto';

describe('UserController (Command) (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, LoggerModule, UserCommandModule],
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
    if (app) {
      await app.close();
    }
  });

  describe('POST /users', () => {
    it('正常系: ユーザーを作成できる', async () => {
      const department = await prisma.department.create({
        data: {
          name: '開発部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const createData = {
        email: 'test@example.com',
        role: 'user',
        firstName: '太郎',
        lastName: '山田',
        gender: 'male',
        departmentId: department.id,
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createData)
        .expect(201);

      const body = response.body as UserResponseDto;
      expect(body).toMatchObject({
        email: createData.email,
        role: createData.role,
        firstName: createData.firstName,
        lastName: createData.lastName,
        gender: createData.gender,
        departmentId: createData.departmentId,
      });
      expect(body.id).toBeDefined();

      const created = await prisma.user.findUnique({
        where: { id: body.id },
      });
      expect(created).toBeDefined();
      expect(created?.email).toBe(createData.email);
    });

    it('異常系: 必須項目が不足している場合は400エラー', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'test@example.com',
        })
        .expect(400);
    });

    it('異常系: メールアドレスの形式が不正な場合は400エラー', async () => {
      const department = await prisma.department.create({
        data: {
          name: '開発部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'invalid-email',
          role: 'user',
          firstName: '太郎',
          lastName: '山田',
          departmentId: department.id,
        })
        .expect(400);

      await prisma.department.delete({ where: { id: department.id } });
    });

    it('異常系: 既に登録されているメールアドレスの場合は400エラー', async () => {
      const department = await prisma.department.create({
        data: {
          name: '開発部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.user.create({
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

      await request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'test@example.com',
          role: 'user',
          firstName: '次郎',
          lastName: '佐藤',
          departmentId: department.id,
        })
        .expect(400);

      await prisma.user.deleteMany();
      await prisma.department.delete({ where: { id: department.id } });
    });
  });

  describe('PUT /users/:id', () => {
    it('正常系: ユーザーを更新できる', async () => {
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

      const updateData = {
        email: 'updated@example.com',
        role: 'admin',
        firstName: '次郎',
        lastName: '山田',
        gender: 'male',
        departmentId: department.id,
      };

      const response = await request(app.getHttpServer())
        .put(`/users/${user.id}`)
        .send(updateData)
        .expect(200);

      const body = response.body as UserResponseDto;
      expect(body).toMatchObject({
        id: user.id,
        email: updateData.email,
        role: updateData.role,
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        gender: updateData.gender,
        departmentId: updateData.departmentId,
      });

      const updated = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(updated?.email).toBe(updateData.email);
    });

    it('異常系: IDを含まないパスにアクセスした場合は404エラー', async () => {
      await request(app.getHttpServer())
        .put('/users/')
        .send({
          email: 'test@example.com',
        })
        .expect(404);
    });

    it('異常系: 存在しないIDの場合は404エラー', async () => {
      const department = await prisma.department.create({
        data: {
          name: '開発部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await request(app.getHttpServer())
        .put('/users/non-existent-id')
        .send({
          email: 'test@example.com',
          role: 'user',
          firstName: '太郎',
          lastName: '山田',
          departmentId: department.id,
          gender: 'male',
        })
        .expect(404);
      await prisma.department.delete({ where: { id: department.id } });
    });

    it('異常系: 必須項目が不足している場合は400エラー', async () => {
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

      await request(app.getHttpServer())
        .put(`/users/${user.id}`)
        .send({
          email: 'test@example.com',
        })
        .expect(400);

      await prisma.user.delete({ where: { id: user.id } });
      await prisma.department.delete({ where: { id: department.id } });
    });
  });

  describe('POST /users/bulk', () => {
    it('正常系: ユーザーを一括作成できる', async () => {
      const department = await prisma.department.create({
        data: {
          name: '開発部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const bulkCreateData = {
        users: [
          {
            email: 'user1@example.com',
            role: 'user',
            firstName: '太郎',
            lastName: '山田',
            gender: 'male',
            departmentId: department.id,
          },
          {
            email: 'user2@example.com',
            role: 'admin',
            firstName: '次郎',
            lastName: '佐藤',
            gender: 'female',
            departmentId: department.id,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/users/bulk')
        .send(bulkCreateData)
        .expect(201);

      const body = response.body as UserResponseDto[];
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(2);

      const createdUsers = await prisma.user.findMany({
        where: {
          email: {
            in: ['user1@example.com', 'user2@example.com'],
          },
        },
      });
      expect(createdUsers.length).toBe(2);
    });

    it('異常系: 必須項目が不足している場合は400エラー', async () => {
      await request(app.getHttpServer())
        .post('/users/bulk')
        .send({
          users: [
            {
              email: 'test@example.com',
            },
          ],
        })
        .expect(400);
    });

    it('異常系: 空のユーザー配列の場合はエラー', async () => {
      await request(app.getHttpServer())
        .post('/users/bulk')
        .send({
          users: [],
        })
        .expect(400);
    });
  });
});
