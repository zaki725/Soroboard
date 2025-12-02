import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DeviationValueCommandModule } from '../../../modules/deviation-value/deviation-value-command.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { LoggerModule } from '../../../config/logger.module';
import { PrismaService } from '../../../prisma.service';
import { DeviationValueResponseDto } from '../../../query/dto/faculty/faculty.dto';

describe('DeviationValueController (Command) (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, LoggerModule, DeviationValueCommandModule],
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
    if (app) {
      await app.close();
    }
  });

  describe('POST /deviation-values', () => {
    it('正常系: 偏差値を作成できる', async () => {
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
        facultyId: faculty.id,
        value: 65,
      };

      const response = await request(app.getHttpServer())
        .post('/deviation-values')
        .send(createData)
        .expect(201);

      const body = response.body as DeviationValueResponseDto;
      expect(body).toMatchObject({
        facultyId: createData.facultyId,
        value: createData.value,
      });
      expect(body.id).toBeDefined();

      const created = await prisma.deviationValue.findUnique({
        where: { id: body.id },
      });
      expect(created).toBeDefined();
      expect(created?.value).toBe(createData.value);
    });

    it('異常系: 必須項目が不足している場合は400エラー', async () => {
      await request(app.getHttpServer())
        .post('/deviation-values')
        .send({
          value: 65,
        })
        .expect(400);
    });

    it('異常系: 存在しない学部IDの場合は404エラー', async () => {
      await request(app.getHttpServer())
        .post('/deviation-values')
        .send({
          facultyId: 'non-existent-id',
          value: 65,
        })
        .expect(404);
    });

    it('異常系: 同じ学部で重複作成できない', async () => {
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

      await request(app.getHttpServer())
        .post('/deviation-values')
        .send({
          facultyId: faculty.id,
          value: 70,
        })
        .expect(400);
    });
  });

  describe('PUT /deviation-values', () => {
    it('正常系: 偏差値を更新できる', async () => {
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

      const deviationValue = await prisma.deviationValue.create({
        data: {
          facultyId: faculty.id,
          value: 65,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const updateData = {
        id: deviationValue.id,
        value: 70,
      };

      const response = await request(app.getHttpServer())
        .put('/deviation-values')
        .send(updateData)
        .expect(200);

      const body = response.body as DeviationValueResponseDto;
      expect(body).toMatchObject({
        id: deviationValue.id,
        value: updateData.value,
      });

      const updated = await prisma.deviationValue.findUnique({
        where: { id: deviationValue.id },
      });
      expect(updated?.value).toBe(updateData.value);
    });

    it('異常系: IDが不足している場合は400エラー', async () => {
      await request(app.getHttpServer())
        .put('/deviation-values')
        .send({
          value: 70,
        })
        .expect(400);
    });

    it('異常系: 存在しないIDの場合は404エラー', async () => {
      await request(app.getHttpServer())
        .put('/deviation-values')
        .send({
          id: 'non-existent-id',
          value: 70,
        })
        .expect(404);
    });
  });

  describe('DELETE /deviation-values/:id', () => {
    it('正常系: 偏差値を削除できる', async () => {
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

      const deviationValue = await prisma.deviationValue.create({
        data: {
          facultyId: faculty.id,
          value: 65,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await request(app.getHttpServer())
        .delete(`/deviation-values/${deviationValue.id}`)
        .expect(204);

      const deleted = await prisma.deviationValue.findUnique({
        where: { id: deviationValue.id },
      });
      expect(deleted).toBeNull();
    });

    it('異常系: パスパラメータが不足している場合は404エラー', async () => {
      await request(app.getHttpServer())
        .delete('/deviation-values/')
        .expect(404);
    });

    it('異常系: 存在しないIDの場合は404エラー', async () => {
      await request(app.getHttpServer())
        .delete('/deviation-values/non-existent-id')
        .expect(404);
    });
  });
});
