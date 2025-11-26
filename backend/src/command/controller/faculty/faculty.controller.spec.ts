import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { FacultyCommandModule } from '../../../modules/faculty/faculty-command.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { PrismaService } from '../../../prisma.service';
import { FacultyResponseDto } from '../../../query/dto/faculty/faculty.dto';

describe('FacultyController (Command) (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, FacultyCommandModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    // テスト前にクリーンアップ
    await prisma.educationalBackground.deleteMany();
    await prisma.deviationValue.deleteMany();
    await prisma.faculty.deleteMany();
    await prisma.interviewer.deleteMany();
    await prisma.university.deleteMany();
  });

  afterEach(async () => {
    // テスト後にクリーンアップ
    try {
      await prisma.educationalBackground.deleteMany();
      await prisma.deviationValue.deleteMany();
      await prisma.faculty.deleteMany();
      await prisma.interviewer.deleteMany();
      await prisma.university.deleteMany();
    } catch {
      // テーブルが存在しない場合は無視
    }
    await app.close();
  });

  describe('POST /faculties', () => {
    it('正常系: 学部を作成できる', async () => {
      const university = await prisma.university.create({
        data: {
          name: 'テスト大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const createData = {
        name: '工学部',
        universityId: university.id,
      };

      const response = await request(app.getHttpServer())
        .post('/faculties')
        .send(createData)
        .expect(201);

      const body = response.body as FacultyResponseDto;
      expect(body).toMatchObject({
        name: createData.name,
        universityId: createData.universityId,
      });
      expect(body.id).toBeDefined();

      const created = await prisma.faculty.findUnique({
        where: { id: body.id },
      });
      expect(created).toBeDefined();
      expect(created?.name).toBe(createData.name);
    });

    it('正常系: 偏差値付きで学部を作成できる', async () => {
      const university = await prisma.university.create({
        data: {
          name: 'テスト大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const createData = {
        name: '工学部',
        universityId: university.id,
        deviationValue: 65,
      };

      const response = await request(app.getHttpServer())
        .post('/faculties')
        .send(createData)
        .expect(201);

      const body = response.body as FacultyResponseDto;
      expect(body).toMatchObject({
        name: createData.name,
        universityId: createData.universityId,
      });
      expect(body.deviationValue).toBeDefined();
      expect(body.deviationValue?.value).toBe(createData.deviationValue);
    });

    it('異常系: 必須項目が不足している場合は400エラー', async () => {
      await request(app.getHttpServer())
        .post('/faculties')
        .send({
          name: '工学部',
        })
        .expect(400);
    });

    it('異常系: 存在しない大学IDの場合は404エラー', async () => {
      await request(app.getHttpServer())
        .post('/faculties')
        .send({
          name: '工学部',
          universityId: 'non-existent-id',
        })
        .expect(404);
    });

    it('異常系: 同じ大学内で同じ名前の学部を重複作成できない', async () => {
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

      await request(app.getHttpServer())
        .post('/faculties')
        .send({
          name: '工学部',
          universityId: university.id,
        })
        .expect(400);

      await prisma.faculty.deleteMany();
      await prisma.university.delete({ where: { id: university.id } });
    });
  });

  describe('PUT /faculties', () => {
    it('正常系: 学部を更新できる', async () => {
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

      const updateData = {
        id: faculty.id,
        name: '工学部（更新）',
      };

      const response = await request(app.getHttpServer())
        .put('/faculties')
        .send(updateData)
        .expect(200);

      const body = response.body as FacultyResponseDto;
      expect(body).toMatchObject({
        id: faculty.id,
        name: updateData.name,
      });

      const updated = await prisma.faculty.findUnique({
        where: { id: faculty.id },
      });
      expect(updated?.name).toBe(updateData.name);
    });

    it('正常系: 偏差値を追加して学部を更新できる', async () => {
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

      const updateData = {
        id: faculty.id,
        name: '工学部',
        deviationValue: 65,
      };

      const response = await request(app.getHttpServer())
        .put('/faculties')
        .send(updateData)
        .expect(200);

      const body = response.body as FacultyResponseDto;
      expect(body.deviationValue).toBeDefined();
      expect(body.deviationValue?.value).toBe(updateData.deviationValue);
    });

    it('異常系: IDが不足している場合は400エラー', async () => {
      await request(app.getHttpServer())
        .put('/faculties')
        .send({
          name: '工学部',
        })
        .expect(400);
    });

    it('異常系: 存在しないIDの場合は404エラー', async () => {
      await request(app.getHttpServer())
        .put('/faculties')
        .send({
          id: 'non-existent-id',
          name: '工学部',
        })
        .expect(404);
    });
  });

  describe('DELETE /faculties/:id', () => {
    it('正常系: 学部を削除できる', async () => {
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
        .delete(`/faculties/${faculty.id}`)
        .expect(204);

      const deleted = await prisma.faculty.findUnique({
        where: { id: faculty.id },
      });
      expect(deleted).toBeNull();
    });

    it('異常系: ルートが不正な場合は404エラー', async () => {
      await request(app.getHttpServer()).delete('/faculties/').expect(404);
    });

    it('異常系: 存在しないIDの場合は404エラー', async () => {
      await request(app.getHttpServer())
        .delete('/faculties/non-existent-id')
        .expect(404);
    });
  });

  describe('POST /faculties/universities/:universityId/bulk', () => {
    it('正常系: 学部・偏差値を一括登録できる', async () => {
      const university = await prisma.university.create({
        data: {
          name: 'テスト大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const bulkCreateData = {
        faculties: [
          {
            name: '工学部',
            deviationValue: 65,
          },
          {
            name: '文学部',
            deviationValue: 60,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post(`/faculties/universities/${university.id}/bulk`)
        .send(bulkCreateData)
        .expect(201);

      const body = response.body as FacultyResponseDto[];
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(2);

      const faculties = await prisma.faculty.findMany({
        where: { universityId: university.id },
      });
      expect(faculties.length).toBe(2);
    });

    it('正常系: 偏差値なしで学部を一括登録できる', async () => {
      const university = await prisma.university.create({
        data: {
          name: 'テスト大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await request(app.getHttpServer())
        .post(`/faculties/universities/${university.id}/bulk`)
        .send({
          faculties: [
            {
              name: '工学部',
            },
          ],
        })
        .expect(201);
    });

    it('異常系: 存在しない大学IDの場合は404エラー', async () => {
      await request(app.getHttpServer())
        .post('/faculties/universities/non-existent-id/bulk')
        .send({
          faculties: [
            {
              name: '工学部',
            },
          ],
        })
        .expect(404);
    });
  });
});
