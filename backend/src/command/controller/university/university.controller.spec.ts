import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UniversityCommandModule } from '../../../modules/university/university-command.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { PrismaService } from '../../../prisma.service';
import { UniversityResponseDto } from '../../../query/dto/university/university.dto';

describe('UniversityController (Command) (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, UniversityCommandModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    // テスト前にクリーンアップ
    await prisma.educationalBackground.deleteMany();
    await prisma.deviationValue.deleteMany();
    await prisma.faculty.deleteMany();
    await prisma.universityRank.deleteMany();
    await prisma.interviewer.deleteMany();
    await prisma.university.deleteMany();
  });

  afterEach(async () => {
    // テスト後にクリーンアップ
    try {
      await prisma.educationalBackground.deleteMany();
      await prisma.deviationValue.deleteMany();
      await prisma.faculty.deleteMany();
      await prisma.universityRank.deleteMany();
      await prisma.interviewer.deleteMany();
      await prisma.university.deleteMany();
    } catch {
      // テーブルが存在しない場合は無視
    }
    await app.close();
  });

  describe('POST /universities', () => {
    it('正常系: 大学を作成できる', async () => {
      const createData = {
        name: 'テスト大学',
      };

      const response = await request(app.getHttpServer())
        .post('/universities')
        .send(createData)
        .expect(201);

      const body = response.body as UniversityResponseDto;
      expect(body).toMatchObject({
        name: createData.name,
      });
      expect(body.id).toBeDefined();

      const created = await prisma.university.findUnique({
        where: { id: body.id },
      });
      expect(created).toBeDefined();
      expect(created?.name).toBe(createData.name);
    });

    it('正常系: ランク付きで大学を作成できる', async () => {
      const createData = {
        name: 'テスト大学',
        rank: 'S',
      };

      const response = await request(app.getHttpServer())
        .post('/universities')
        .send(createData)
        .expect(201);

      const body = response.body as UniversityResponseDto;
      expect(body).toMatchObject({
        name: createData.name,
        rank: createData.rank,
      });

      const rank = await prisma.universityRank.findFirst({
        where: { universityId: body.id },
      });
      expect(rank).toBeDefined();
      expect(rank?.rank).toBe(createData.rank);
    });

    it('異常系: 必須項目が不足している場合は400エラー', async () => {
      await request(app.getHttpServer())
        .post('/universities')
        .send({})
        .expect(400);
    });

    it('異常系: 大学名が空文字の場合は400エラー', async () => {
      await request(app.getHttpServer())
        .post('/universities')
        .send({ name: '' })
        .expect(400);
    });

    it('異常系: 同じ名前の大学を重複作成できない', async () => {
      const university = await prisma.university.create({
        data: {
          name: 'テスト大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await request(app.getHttpServer())
        .post('/universities')
        .send({ name: 'テスト大学' })
        .expect(400);

      await prisma.university.delete({ where: { id: university.id } });
    });
  });

  describe('PUT /universities', () => {
    it('正常系: 大学を更新できる', async () => {
      const university = await prisma.university.create({
        data: {
          name: 'テスト大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const updateData = {
        id: university.id,
        name: 'テスト大学（更新）',
      };

      const response = await request(app.getHttpServer())
        .put('/universities')
        .send(updateData)
        .expect(200);

      const body = response.body as UniversityResponseDto;
      expect(body).toMatchObject({
        id: university.id,
        name: updateData.name,
      });

      const updated = await prisma.university.findUnique({
        where: { id: university.id },
      });
      expect(updated?.name).toBe(updateData.name);
    });

    it('正常系: ランクを追加して大学を更新できる', async () => {
      const university = await prisma.university.create({
        data: {
          name: 'テスト大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const updateData = {
        id: university.id,
        name: 'テスト大学',
        rank: 'A',
      };

      const response = await request(app.getHttpServer())
        .put('/universities')
        .send(updateData)
        .expect(200);

      const body = response.body as UniversityResponseDto;
      expect(body).toMatchObject({
        id: university.id,
        name: updateData.name,
        rank: updateData.rank,
      });

      const rank = await prisma.universityRank.findFirst({
        where: { universityId: university.id },
      });
      expect(rank).toBeDefined();
      expect(rank?.rank).toBe(updateData.rank);
    });

    it('異常系: IDが不足している場合は400エラー', async () => {
      await request(app.getHttpServer())
        .put('/universities')
        .send({
          name: 'テスト大学',
        })
        .expect(400);
    });

    it('異常系: 存在しないIDの場合は404エラー', async () => {
      await request(app.getHttpServer())
        .put('/universities')
        .send({
          id: 'non-existent-id',
          name: 'テスト大学',
        })
        .expect(404);
    });
  });

  describe('DELETE /universities/:id', () => {
    it('正常系: 大学を削除できる', async () => {
      const university = await prisma.university.create({
        data: {
          name: 'テスト大学',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await request(app.getHttpServer())
        .delete(`/universities/${university.id}`)
        .expect(204);

      const deleted = await prisma.university.findUnique({
        where: { id: university.id },
      });
      expect(deleted).toBeNull();
    });

    it('異常系: IDを含まないパスにアクセスした場合は404エラー', async () => {
      await request(app.getHttpServer()).delete('/universities/').expect(404);
    });

    it('異常系: 存在しないIDの場合は404エラー', async () => {
      await request(app.getHttpServer())
        .delete('/universities/non-existent-id')
        .expect(404);
    });
  });

  describe('POST /universities/bulk', () => {
    it('正常系: 大学・学部・偏差値を一括登録できる', async () => {
      const bulkCreateData = {
        name: 'テスト大学',
        rank: 'S',
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
        .post('/universities/bulk')
        .send(bulkCreateData)
        .expect(201);

      const body = response.body as UniversityResponseDto;
      expect(body).toMatchObject({
        name: bulkCreateData.name,
        rank: bulkCreateData.rank,
      });
      expect(body.id).toBeDefined();

      const created = await prisma.university.findUnique({
        where: { id: body.id },
      });
      expect(created).toBeDefined();

      const faculties = await prisma.faculty.findMany({
        where: { universityId: body.id },
      });
      expect(faculties.length).toBe(2);
    });

    it('異常系: 必須項目が不足している場合は400エラー', async () => {
      await request(app.getHttpServer())
        .post('/universities/bulk')
        .send({
          rank: 'S',
          faculties: [],
        })
        .expect(400);
    });
  });
});
