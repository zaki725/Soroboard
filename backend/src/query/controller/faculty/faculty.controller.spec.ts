import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { FacultyQueryModule } from '../../../modules/faculty/faculty-query.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { PrismaService } from '../../../prisma.service';

describe('FacultyController (Query) (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, FacultyQueryModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    // テスト前にクリーンアップ
    await prisma.deviationValue.deleteMany();
    await prisma.faculty.deleteMany();
    await prisma.university.deleteMany();
  });

  afterEach(async () => {
    // テスト後にクリーンアップ
    try {
      await prisma.deviationValue.deleteMany();
      await prisma.faculty.deleteMany();
      await prisma.university.deleteMany();
    } catch {
      // テーブルが存在しない場合は無視
    }
    await app.close();
  });

  describe('GET /universities/:universityId/faculties', () => {
    it('正常系: 大学に紐づく学部一覧を取得できる', async () => {
      const university = await prisma.university.create({
        data: {
          name: 'テスト大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.faculty.create({
        data: {
          name: '工学部',
          universityId: university.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.faculty.create({
        data: {
          name: '文学部',
          universityId: university.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/universities/${university.id}/faculties`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body.map((f: { name: string }) => f.name)).toEqual(
        expect.arrayContaining(['工学部', '文学部']),
      );
    });

    it('正常系: 偏差値も取得できる', async () => {
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

      await prisma.deviationValue.create({
        data: {
          facultyId: faculty.id,
          value: 65,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/universities/${university.id}/faculties`)
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].deviationValue).toBeDefined();
      expect(response.body[0].deviationValue.value).toBe(65);
    });

    it('正常系: データがない場合は空配列を返す', async () => {
      const university = await prisma.university.create({
        data: {
          name: 'テスト大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/universities/${university.id}/faculties`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('異常系: 存在しない大学IDの場合は空配列を返す', async () => {
      const response = await request(app.getHttpServer())
        .get('/universities/non-existent-id/faculties')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('正常系: 異なる大学の学部は取得されない', async () => {
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

      await prisma.faculty.create({
        data: {
          name: '工学部',
          universityId: university1.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.faculty.create({
        data: {
          name: '文学部',
          universityId: university2.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/universities/${university1.id}/faculties`)
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('工学部');
    });
  });
});
