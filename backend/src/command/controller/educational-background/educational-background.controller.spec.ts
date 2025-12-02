import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { EducationalBackgroundCommandModule } from '../../../modules/educational-background/educational-background-command.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { LoggerModule } from '../../../config/logger.module';
import { PrismaService } from '../../../prisma.service';
import { EducationalBackgroundResponseDto } from '../../../query/dto/educational-background/educational-background.dto';

describe('EducationalBackgroundController (Command) (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, LoggerModule, EducationalBackgroundCommandModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    // テスト前にクリーンアップ
    await prisma.educationalBackground.deleteMany();
    await prisma.interviewer.deleteMany();
    await prisma.user.deleteMany();
    await prisma.department.deleteMany();
    await prisma.faculty.deleteMany();
    await prisma.university.deleteMany();
  });

  afterEach(async () => {
    // テスト後にクリーンアップ
    try {
      await prisma.educationalBackground.deleteMany();
      await prisma.interviewer.deleteMany();
      await prisma.user.deleteMany();
      await prisma.department.deleteMany();
      await prisma.faculty.deleteMany();
      await prisma.university.deleteMany();
    } catch {
      // テーブルが存在しない場合は無視
    }
    if (app) {
      await app.close();
    }
  });

  describe('POST /educational-backgrounds', () => {
    it('正常系: 学歴を作成できる', async () => {
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

      const interviewer = await prisma.interviewer.create({
        data: {
          userId: user.id,
          category: 'フロント',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const university = await prisma.university.create({
        data: {
          name: 'テスト大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const faculty = await prisma.faculty.create({
        data: {
          name: '工学部',
          universityId: university.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const createData = {
        interviewerId: interviewer.userId,
        educationType: '大学',
        universityId: university.id,
        facultyId: faculty.id,
      };

      const response = await request(app.getHttpServer())
        .post('/educational-backgrounds')
        .send(createData)
        .expect(201);

      const body = response.body as EducationalBackgroundResponseDto;
      expect(body).toMatchObject({
        interviewerId: createData.interviewerId,
        educationType: createData.educationType,
        universityId: createData.universityId,
        facultyId: createData.facultyId,
      });
      expect(body.id).toBeDefined();

      const created = await prisma.educationalBackground.findUnique({
        where: { id: body.id },
      });
      expect(created).toBeDefined();
      expect(created?.educationType).toBe(createData.educationType);
    });

    it('正常系: 大学・学部・卒業年月付きで学歴を作成できる', async () => {
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

      const interviewer = await prisma.interviewer.create({
        data: {
          userId: user.id,
          category: 'フロント',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const university = await prisma.university.create({
        data: {
          name: 'テスト大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const faculty = await prisma.faculty.create({
        data: {
          name: '工学部',
          universityId: university.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const createData = {
        interviewerId: interviewer.userId,
        educationType: '大学',
        universityId: university.id,
        facultyId: faculty.id,
        graduationYear: 2020,
        graduationMonth: 3,
      };

      const response = await request(app.getHttpServer())
        .post('/educational-backgrounds')
        .send(createData)
        .expect(201);

      const body = response.body as EducationalBackgroundResponseDto;
      expect(body).toMatchObject({
        interviewerId: createData.interviewerId,
        educationType: createData.educationType,
        universityId: createData.universityId,
        facultyId: createData.facultyId,
        graduationYear: createData.graduationYear,
        graduationMonth: createData.graduationMonth,
      });
    });

    it('異常系: 必須項目が不足している場合は400エラー', async () => {
      await request(app.getHttpServer())
        .post('/educational-backgrounds')
        .send({
          educationType: '大学',
        })
        .expect(400);
    });

    it('異常系: 存在しない面接官IDの場合は404エラー', async () => {
      const university = await prisma.university.create({
        data: {
          name: 'テスト大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const faculty = await prisma.faculty.create({
        data: {
          name: '工学部',
          universityId: university.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await request(app.getHttpServer())
        .post('/educational-backgrounds')
        .send({
          interviewerId: 'non-existent-id',
          educationType: '大学',
          universityId: university.id,
          facultyId: faculty.id,
        })
        .expect(404);
    });
  });

  describe('PUT /educational-backgrounds', () => {
    it('正常系: 学歴を更新できる', async () => {
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

      const interviewer = await prisma.interviewer.create({
        data: {
          userId: user.id,
          category: 'フロント',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const university = await prisma.university.create({
        data: {
          name: 'テスト大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const faculty = await prisma.faculty.create({
        data: {
          name: '工学部',
          universityId: university.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const educationalBackground = await prisma.educationalBackground.create({
        data: {
          interviewerId: interviewer.userId,
          educationType: '大学',
          universityId: university.id,
          facultyId: faculty.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const updateData = {
        id: educationalBackground.id,
        educationType: '大学院',
        universityId: university.id,
        facultyId: faculty.id,
        graduationYear: 2022,
        graduationMonth: 3,
      };

      const response = await request(app.getHttpServer())
        .put('/educational-backgrounds')
        .send(updateData)
        .expect(200);

      const body = response.body as EducationalBackgroundResponseDto;
      expect(body).toMatchObject({
        id: educationalBackground.id,
        educationType: updateData.educationType,
        universityId: updateData.universityId,
        facultyId: updateData.facultyId,
        graduationYear: updateData.graduationYear,
        graduationMonth: updateData.graduationMonth,
      });

      const updated = await prisma.educationalBackground.findUnique({
        where: { id: educationalBackground.id },
      });
      expect(updated?.educationType).toBe(updateData.educationType);
    });

    it('異常系: IDが不足している場合は400エラー', async () => {
      await request(app.getHttpServer())
        .put('/educational-backgrounds')
        .send({
          educationType: '大学',
        })
        .expect(400);
    });

    it('異常系: 存在しないIDの場合は404エラー', async () => {
      await request(app.getHttpServer())
        .put('/educational-backgrounds')
        .send({
          id: 'non-existent-id',
          educationType: '大学',
        })
        .expect(404);
    });
  });

  describe('DELETE /educational-backgrounds/:id', () => {
    it('正常系: 学歴を削除できる', async () => {
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

      const interviewer = await prisma.interviewer.create({
        data: {
          userId: user.id,
          category: 'フロント',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const educationalBackground = await prisma.educationalBackground.create({
        data: {
          interviewerId: interviewer.userId,
          educationType: '大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await request(app.getHttpServer())
        .delete(`/educational-backgrounds/${educationalBackground.id}`)
        .expect(204);

      const deleted = await prisma.educationalBackground.findUnique({
        where: { id: educationalBackground.id },
      });
      expect(deleted).toBeNull();
    });

    it('異常系: IDが不足している場合は404エラー', async () => {
      await request(app.getHttpServer())
        .delete('/educational-backgrounds/')
        .expect(404);
    });

    it('異常系: 存在しないIDの場合は404エラー', async () => {
      await request(app.getHttpServer())
        .delete('/educational-backgrounds/non-existent-id')
        .expect(404);
    });
  });

  describe('GET /educational-backgrounds/interviewers/:interviewerId', () => {
    it('正常系: 面接官の学歴一覧を取得できる', async () => {
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

      const interviewer = await prisma.interviewer.create({
        data: {
          userId: user.id,
          category: 'フロント',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.educationalBackground.create({
        data: {
          interviewerId: interviewer.userId,
          educationType: '大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.educationalBackground.create({
        data: {
          interviewerId: interviewer.userId,
          educationType: '大学院',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/educational-backgrounds/interviewers/${interviewer.userId}`)
        .expect(200);

      const body = response.body as EducationalBackgroundResponseDto[];
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(2);
    });

    it('正常系: 学歴が0件の場合は空配列を返す', async () => {
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

      const interviewer = await prisma.interviewer.create({
        data: {
          userId: user.id,
          category: 'フロント',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/educational-backgrounds/interviewers/${interviewer.userId}`)
        .expect(200);

      const body = response.body as EducationalBackgroundResponseDto[];
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(0);
    });

    it('異常系: IDが不足している場合は404エラー', async () => {
      await request(app.getHttpServer())
        .get('/educational-backgrounds/interviewers/')
        .expect(404);
    });
  });
});
