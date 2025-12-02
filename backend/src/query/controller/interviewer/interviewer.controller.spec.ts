import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { InterviewerQueryModule } from '../../../modules/interviewer/interviewer-query.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { PrismaService } from '../../../prisma.service';

describe('InterviewerController (Query) (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, InterviewerQueryModule],
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

  describe('GET /interviewers', () => {
    it('正常系: 面接官一覧を取得できる', async () => {
      const department1 = await prisma.department.create({
        data: {
          name: '技術部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const department2 = await prisma.department.create({
        data: {
          name: '営業部',
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
          departmentId: department1.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const user2 = await prisma.user.create({
        data: {
          email: 'test2@example.com',
          firstName: '花子',
          lastName: '佐藤',
          role: 'user',
          departmentId: department2.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.interviewer.create({
        data: {
          userId: user1.id,
          category: 'フロント',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.interviewer.create({
        data: {
          userId: user2.id,
          category: '現場社員',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/interviewers')
        .expect(200);

      expect(response.body.interviewers).toHaveLength(2);
      expect(response.body.interviewers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            userId: user1.id,
            category: 'フロント',
            userName: `${user1.lastName} ${user1.firstName}`,
            userEmail: user1.email,
          }),
          expect.objectContaining({
            userId: user2.id,
            category: '現場社員',
            userName: `${user2.lastName} ${user2.firstName}`,
            userEmail: user2.email,
          }),
        ]),
      );
    });

    it('正常系: IDでフィルタリングできる', async () => {
      const department = await prisma.department.create({
        data: {
          name: '技術部',
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

      const user2 = await prisma.user.create({
        data: {
          email: 'test2@example.com',
          firstName: '花子',
          lastName: '佐藤',
          role: 'user',
          departmentId: department.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.interviewer.create({
        data: {
          userId: user1.id,
          category: 'フロント',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.interviewer.create({
        data: {
          userId: user2.id,
          category: 'フロント',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/interviewers?userId=${user1.id}`)
        .expect(200);

      expect(response.body.interviewers).toHaveLength(1);
      expect(response.body.interviewers[0].userId).toBe(user1.id);
    });

    it('正常系: 複数のIDでフィルタリングできる（カンマ区切り）', async () => {
      const department = await prisma.department.create({
        data: {
          name: '技術部',
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

      const user2 = await prisma.user.create({
        data: {
          email: 'test2@example.com',
          firstName: '花子',
          lastName: '佐藤',
          role: 'user',
          departmentId: department.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const user3 = await prisma.user.create({
        data: {
          email: 'test3@example.com',
          firstName: '一郎',
          lastName: '鈴木',
          role: 'user',
          departmentId: department.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.interviewer.create({
        data: {
          userId: user1.id,
          category: 'フロント',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.interviewer.create({
        data: {
          userId: user2.id,
          category: 'フロント',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.interviewer.create({
        data: {
          userId: user3.id,
          category: '現場社員',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/interviewers?userId=${user1.id},${user2.id}`)
        .expect(200);

      expect(response.body.interviewers).toHaveLength(2);
      expect(
        response.body.interviewers.map((i: { userId: string }) => i.userId),
      ).toEqual(expect.arrayContaining([user1.id, user2.id]));
    });

    it('正常系: 検索キーワードで名前を検索できる', async () => {
      const department = await prisma.department.create({
        data: {
          name: '技術部',
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

      const user2 = await prisma.user.create({
        data: {
          email: 'test2@example.com',
          firstName: '花子',
          lastName: '佐藤',
          role: 'user',
          departmentId: department.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.interviewer.create({
        data: {
          userId: user1.id,
          category: 'フロント',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.interviewer.create({
        data: {
          userId: user2.id,
          category: 'フロント',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/interviewers?search=山田')
        .expect(200);

      expect(response.body.interviewers).toHaveLength(1);
      expect(response.body.interviewers[0].userName).toContain('山田');
    });

    it('正常系: 検索キーワードでメールアドレスを検索できる', async () => {
      const department = await prisma.department.create({
        data: {
          name: '技術部',
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

      const user2 = await prisma.user.create({
        data: {
          email: 'test2@example.com',
          firstName: '花子',
          lastName: '佐藤',
          role: 'user',
          departmentId: department.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.interviewer.create({
        data: {
          userId: user1.id,
          category: 'フロント',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.interviewer.create({
        data: {
          userId: user2.id,
          category: 'フロント',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/interviewers?search=test1@example.com')
        .expect(200);

      expect(response.body.interviewers).toHaveLength(1);
      expect(response.body.interviewers[0].userEmail).toBe('test1@example.com');
    });

    it('正常系: データがない場合は空配列を返す', async () => {
      const response = await request(app.getHttpServer())
        .get('/interviewers')
        .expect(200);

      expect(response.body.interviewers).toEqual([]);
    });
  });

  describe('GET /interviewers/:userId', () => {
    it('正常系: 面接官詳細を取得できる', async () => {
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

      const response = await request(app.getHttpServer())
        .get(`/interviewers/${user.id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        userId: user.id,
        category: 'フロント',
        userName: `${user.lastName} ${user.firstName}`,
        userEmail: user.email,
      });
    });

    it('異常系: 存在しない面接官IDの場合は404エラー', async () => {
      await request(app.getHttpServer())
        .get('/interviewers/non-existent-id')
        .expect(404);
    });
  });
});
