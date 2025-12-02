import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { InterviewerCommandModule } from '../../../modules/interviewer/interviewer-command.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { LoggerModule } from '../../../config/logger.module';
import { PrismaService } from '../../../prisma.service';

describe('InterviewerController (Command) (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, LoggerModule, InterviewerCommandModule],
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

  describe('POST /interviewers', () => {
    it('正常系: 面接官を作成できる', async () => {
      const department = await prisma.department.create({
        data: {
          name: '技術部',
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

      const createData = {
        userId: user.id,
        category: 'フロント',
      };

      const response = await request(app.getHttpServer())
        .post('/interviewers')
        .send(createData)
        .expect(201);

      expect(response.body).toMatchObject({
        userId: user.id,
        category: 'フロント',
      });

      const created = await prisma.interviewer.findUnique({
        where: { userId: user.id },
      });
      expect(created).toBeDefined();
      expect(created?.userId).toBe(user.id);
      expect(created?.category).toBe('フロント');
    });

    it('異常系: 必須項目が不足している場合は400エラー', async () => {
      await request(app.getHttpServer())
        .post('/interviewers')
        .send({
          category: 'フロント',
        })
        .expect(400);

      await request(app.getHttpServer())
        .post('/interviewers')
        .send({
          userId: 'user-id',
        })
        .expect(400);
    });

    it('異常系: 存在しないユーザーIDの場合は404エラー', async () => {
      await request(app.getHttpServer())
        .post('/interviewers')
        .send({
          userId: 'non-existent-user-id',
          category: 'フロント',
        })
        .expect(404);
    });

    it('異常系: 既に面接官として登録されているユーザーの場合は400エラー', async () => {
      const department = await prisma.department.create({
        data: {
          name: '技術部',
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

      // 最初の面接官登録
      await prisma.interviewer.create({
        data: {
          userId: user.id,
          category: 'フロント',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      // 同じユーザーで再度登録を試みる
      await request(app.getHttpServer())
        .post('/interviewers')
        .send({
          userId: user.id,
          category: '現場社員',
        })
        .expect(400);
    });
  });

  describe('PUT /interviewers', () => {
    it('正常系: 面接官を更新できる', async () => {
      const department = await prisma.department.create({
        data: {
          name: '技術部',
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

      await prisma.interviewer.create({
        data: {
          userId: user.id,
          category: 'フロント',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const updateData = {
        userId: user.id,
        category: '現場社員',
      };

      const response = await request(app.getHttpServer())
        .put('/interviewers')
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        userId: user.id,
        category: '現場社員',
      });

      const updated = await prisma.interviewer.findUnique({
        where: { userId: user.id },
      });
      expect(updated).toBeDefined();
      expect(updated?.category).toBe('現場社員');
    });

    it('異常系: 必須項目が不足している場合は400エラー', async () => {
      await request(app.getHttpServer())
        .put('/interviewers')
        .send({
          category: 'フロント',
        })
        .expect(400);

      await request(app.getHttpServer())
        .put('/interviewers')
        .send({
          userId: 'user-id',
        })
        .expect(400);
    });

    it('異常系: 存在しない面接官IDの場合は404エラー', async () => {
      await request(app.getHttpServer())
        .put('/interviewers')
        .send({
          userId: 'non-existent-user-id',
          category: 'フロント',
        })
        .expect(404);
    });
  });

  describe('DELETE /interviewers/:userId', () => {
    it('正常系: 面接官を削除できる', async () => {
      const department = await prisma.department.create({
        data: {
          name: '技術部',
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

      await prisma.interviewer.create({
        data: {
          userId: user.id,
          category: 'フロント',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await request(app.getHttpServer())
        .delete(`/interviewers/${user.id}`)
        .expect(204);

      const deleted = await prisma.interviewer.findUnique({
        where: { userId: user.id },
      });
      expect(deleted).toBeNull();
    });

    it('異常系: 存在しない面接官IDの場合は404エラー', async () => {
      await request(app.getHttpServer())
        .delete('/interviewers/non-existent-id')
        .expect(404);
    });
  });

  describe('POST /interviewers/bulk', () => {
    it('正常系: 面接官を一括登録できる', async () => {
      const department = await prisma.department.create({
        data: {
          name: '技術部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const user1 = await prisma.user.create({
        data: {
          email: 'user1@example.com',
          firstName: '太郎',
          lastName: '山田',
          role: 'user',
          departmentId: department.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const user2 = await prisma.user.create({
        data: {
          email: 'user2@example.com',
          firstName: '次郎',
          lastName: '佐藤',
          role: 'user',
          departmentId: department.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const bulkCreateData = {
        interviewers: [
          {
            userId: user1.id,
            category: 'フロント',
          },
          {
            userId: user2.id,
            category: '現場社員',
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/interviewers/bulk')
        .send(bulkCreateData)
        .expect(201);

      const body = response.body;
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(2);

      const createdInterviewers = await prisma.interviewer.findMany({
        where: {
          userId: {
            in: [user1.id, user2.id],
          },
        },
      });
      expect(createdInterviewers.length).toBe(2);
    });

    it('異常系: 必須項目が不足している場合は400エラー', async () => {
      await request(app.getHttpServer())
        .post('/interviewers/bulk')
        .send({
          interviewers: [
            {
              category: 'フロント',
            },
          ],
        })
        .expect(400);
    });

    it('異常系: 空の面接官配列の場合は400エラー', async () => {
      await request(app.getHttpServer())
        .post('/interviewers/bulk')
        .send({
          interviewers: [],
        })
        .expect(400);
    });

    it('異常系: 存在しないユーザーIDの場合は404エラー', async () => {
      await request(app.getHttpServer())
        .post('/interviewers/bulk')
        .send({
          interviewers: [
            {
              userId: 'non-existent-user-id',
              category: 'フロント',
            },
          ],
        })
        .expect(404);
    });
  });
});
