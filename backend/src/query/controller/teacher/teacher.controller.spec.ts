import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TeacherQueryModule } from '../../../modules/teacher/teacher-query.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { PrismaService } from '../../../prisma.service';
import { TeacherRole } from '@prisma/client';

describe('TeacherController (Query) (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, TeacherQueryModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // テスト前にクリーンアップ
    await prisma.teacher.deleteMany();
    await prisma.school.deleteMany();
  });

  describe('GET /teachers', () => {
    it('正常系: 指定したschoolIdの先生だけ返ってくる', async () => {
      // テストデータの準備
      const school1 = await prisma.school.create({
        data: {
          name: '田中そろばん教室',
          isActive: true,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const school2 = await prisma.school.create({
        data: {
          name: '佐藤そろばん教室',
          isActive: true,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      // school1の先生を2人作成
      const teacher1 = await prisma.teacher.create({
        data: {
          email: 'teacher1@tanaka-soroban.example.com',
          roleInSchool: TeacherRole.OWNER,
          firstName: '太郎',
          lastName: '田中',
          hourlyRate: null,
          isActive: true,
          schoolId: school1.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const teacher2 = await prisma.teacher.create({
        data: {
          email: 'teacher2@tanaka-soroban.example.com',
          roleInSchool: TeacherRole.STAFF,
          firstName: '花子',
          lastName: '山田',
          hourlyRate: 2500,
          isActive: true,
          schoolId: school1.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      // school2の先生を1人作成
      await prisma.teacher.create({
        data: {
          email: 'teacher3@sato-soroban.example.com',
          roleInSchool: TeacherRole.OWNER,
          firstName: '一郎',
          lastName: '佐藤',
          hourlyRate: null,
          isActive: true,
          schoolId: school2.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      // school1の先生のみ取得
      const response = await request(app.getHttpServer())
        .get(`/teachers?schoolId=${school1.id}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body.every((t: { schoolId: string }) => t.schoolId === school1.id)).toBe(true);
      expect(response.body.some((t: { id: string }) => t.id === teacher1.id)).toBe(true);
      expect(response.body.some((t: { id: string }) => t.id === teacher2.id)).toBe(true);
    });

    it('正常系: 並び順がcreatedAt descになっている', async () => {
      const school = await prisma.school.create({
        data: {
          name: '田中そろばん教室',
          isActive: true,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      // 最初の先生を作成
      const teacher1 = await prisma.teacher.create({
        data: {
          email: 'teacher1@tanaka-soroban.example.com',
          roleInSchool: TeacherRole.OWNER,
          firstName: '太郎',
          lastName: '田中',
          hourlyRate: null,
          isActive: true,
          schoolId: school.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      // 少し待ってから2人目を作成（createdAtを確実に変えるため）
      await new Promise((resolve) => setTimeout(resolve, 100));

      const teacher2 = await prisma.teacher.create({
        data: {
          email: 'teacher2@tanaka-soroban.example.com',
          roleInSchool: TeacherRole.STAFF,
          firstName: '花子',
          lastName: '山田',
          hourlyRate: 2500,
          isActive: true,
          schoolId: school.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/teachers?schoolId=${school.id}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      // 新しい順（createdAt desc）になっていることを確認
      expect(response.body[0].id).toBe(teacher2.id);
      expect(response.body[1].id).toBe(teacher1.id);
    });

    it('異常系: schoolIdなしで400が返る', async () => {
      const response = await request(app.getHttpServer())
        .get('/teachers')
        .expect(400);

      expect(response.body).toBeDefined();
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /teachers/:id', () => {
    it('正常系: 存在するIDで200が返り、期待した項目が入っている', async () => {
      const school = await prisma.school.create({
        data: {
          name: '田中そろばん教室',
          isActive: true,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const teacher = await prisma.teacher.create({
        data: {
          email: 'teacher1@tanaka-soroban.example.com',
          roleInSchool: TeacherRole.OWNER,
          firstName: '太郎',
          lastName: '田中',
          hourlyRate: null,
          isActive: true,
          memo: 'テストメモ',
          schoolId: school.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/teachers/${teacher.id}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(teacher.id);
      expect(response.body.email).toBe('teacher1@tanaka-soroban.example.com');
      expect(response.body.roleInSchool).toBe(TeacherRole.OWNER);
      expect(response.body.firstName).toBe('太郎');
      expect(response.body.lastName).toBe('田中');
      expect(response.body.hourlyRate).toBeNull();
      expect(response.body.isActive).toBe(true);
      expect(response.body.memo).toBe('テストメモ');
      expect(response.body.schoolId).toBe(school.id);
    });

    it('異常系: 存在しないIDで404が返る', async () => {
      const nonExistentId = '01HZJQKX9Y8N7M6P5Q4R3S2T1U0V';

      const response = await request(app.getHttpServer())
        .get(`/teachers/${nonExistentId}`)
        .expect(404);

      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toBeDefined();
    });
  });
});

