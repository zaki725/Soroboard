import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { StudentQueryModule } from '../../../modules/student/student-query.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { PrismaService } from '../../../prisma.service';
import { StudentStatus } from '@prisma/client';

describe('StudentController (Query) (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, StudentQueryModule],
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
    await prisma.student.deleteMany();
    await prisma.school.deleteMany();
  });

  describe('GET /students', () => {
    it('正常系: 指定したschoolIdの生徒だけ返ってくる', async () => {
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

      // school1の生徒を2人作成
      const student1 = await prisma.student.create({
        data: {
          schoolId: school1.id,
          studentNo: 'S001',
          firstName: '太郎',
          lastName: '田中',
          firstNameKana: 'タロウ',
          lastNameKana: 'タナカ',
          birthDate: new Date('2010-01-01'),
          status: StudentStatus.ACTIVE,
          joinedAt: new Date('2020-04-01'),
          leftAt: null,
          note: null,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const student2 = await prisma.student.create({
        data: {
          schoolId: school1.id,
          studentNo: 'S002',
          firstName: '花子',
          lastName: '山田',
          firstNameKana: 'ハナコ',
          lastNameKana: 'ヤマダ',
          birthDate: new Date('2011-02-15'),
          status: StudentStatus.ACTIVE,
          joinedAt: new Date('2020-04-01'),
          leftAt: null,
          note: '特記事項あり',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      // school2の生徒を1人作成
      await prisma.student.create({
        data: {
          schoolId: school2.id,
          studentNo: 'S001',
          firstName: '一郎',
          lastName: '佐藤',
          firstNameKana: 'イチロウ',
          lastNameKana: 'サトウ',
          birthDate: new Date('2012-03-20'),
          status: StudentStatus.ACTIVE,
          joinedAt: new Date('2021-04-01'),
          leftAt: null,
          note: null,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      // school1の生徒のみ取得
      const response = await request(app.getHttpServer())
        .get(`/students?schoolId=${school1.id}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(
        response.body.every(
          (s: { schoolId: string }) => s.schoolId === school1.id,
        ),
      ).toBe(true);
      expect(response.body.some((s: { id: string }) => s.id === student1.id)).toBe(
        true,
      );
      expect(response.body.some((s: { id: string }) => s.id === student2.id)).toBe(
        true,
      );
    });

    it('異常系: schoolIdなしで400が返る', async () => {
      const response = await request(app.getHttpServer())
        .get('/students')
        .expect(400);

      expect(response.body).toBeDefined();
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /students/:id', () => {
    it('正常系: 存在するIDで200が返り、期待した項目が入っている', async () => {
      const school = await prisma.school.create({
        data: {
          name: '田中そろばん教室',
          isActive: true,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const student = await prisma.student.create({
        data: {
          schoolId: school.id,
          studentNo: 'S001',
          firstName: '太郎',
          lastName: '田中',
          firstNameKana: 'タロウ',
          lastNameKana: 'タナカ',
          birthDate: new Date('2010-01-01'),
          status: StudentStatus.ACTIVE,
          joinedAt: new Date('2020-04-01'),
          leftAt: null,
          note: 'テストメモ',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/students/${student.id}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(student.id);
      expect(response.body.studentNo).toBe('S001');
      expect(response.body.firstName).toBe('太郎');
      expect(response.body.lastName).toBe('田中');
      expect(response.body.firstNameKana).toBe('タロウ');
      expect(response.body.lastNameKana).toBe('タナカ');
      expect(new Date(response.body.birthDate)).toEqual(
        new Date('2010-01-01'),
      );
      expect(response.body.status).toBe(StudentStatus.ACTIVE);
      expect(new Date(response.body.joinedAt)).toEqual(
        new Date('2020-04-01'),
      );
      expect(response.body.leftAt).toBeNull();
      expect(response.body.note).toBe('テストメモ');
    });

    it('異常系: 存在しないIDで404が返る', async () => {
      const nonExistentId = '01HZJQKX9Y8N7M6P5Q4R3S2T1U0V';

      const response = await request(app.getHttpServer())
        .get(`/students/${nonExistentId}`)
        .expect(404);

      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toBeDefined();
    });
  });
});

