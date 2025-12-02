import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DepartmentCommandModule } from '../../../modules/department/department-command.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { LoggerModule } from '../../../config/logger.module';
import { PrismaService } from '../../../prisma.service';
import { DepartmentResponseDto } from '../../../query/dto/department/department.dto';

describe('DepartmentController (Command) (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, LoggerModule, DepartmentCommandModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    // テスト前にクリーンアップ
    await prisma.user.deleteMany();
    await prisma.department.deleteMany();
  });

  afterEach(async () => {
    // テスト後にクリーンアップ
    try {
      await prisma.user.deleteMany();
      await prisma.department.deleteMany();
    } catch {
      // テーブルが存在しない場合は無視
    }
    if (app) {
      await app.close();
    }
  });

  describe('POST /departments', () => {
    it('正常系: 部署を作成できる', async () => {
      const createData = {
        name: '開発部',
      };

      const response = await request(app.getHttpServer())
        .post('/departments')
        .send(createData)
        .expect(201);

      const body = response.body as DepartmentResponseDto;
      expect(body).toMatchObject({
        name: createData.name,
      });
      expect(body.id).toBeDefined();

      const created = await prisma.department.findUnique({
        where: { id: body.id },
      });
      expect(created).toBeDefined();
      expect(created?.name).toBe(createData.name);
    });

    it('異常系: 必須項目が不足している場合は400エラー', async () => {
      await request(app.getHttpServer())
        .post('/departments')
        .send({})
        .expect(400);
    });

    it('異常系: 部署名が空文字の場合は400エラー', async () => {
      await request(app.getHttpServer())
        .post('/departments')
        .send({ name: '' })
        .expect(400);
    });

    it('異常系: 同じ名前の部署を重複作成できない', async () => {
      const department = await prisma.department.create({
        data: {
          name: '開発部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await request(app.getHttpServer())
        .post('/departments')
        .send({ name: '開発部' })
        .expect(400);

      await prisma.department.delete({ where: { id: department.id } });
    });
  });

  describe('PUT /departments', () => {
    it('正常系: 部署を更新できる', async () => {
      const department = await prisma.department.create({
        data: {
          name: '開発部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const updateData = {
        id: department.id,
        name: '開発部（更新）',
      };

      const response = await request(app.getHttpServer())
        .put('/departments')
        .send(updateData)
        .expect(200);

      const body = response.body as DepartmentResponseDto;
      expect(body).toMatchObject({
        id: department.id,
        name: updateData.name,
      });

      const updated = await prisma.department.findUnique({
        where: { id: department.id },
      });
      expect(updated?.name).toBe(updateData.name);
    });

    it('異常系: IDが不足している場合は400エラー', async () => {
      await request(app.getHttpServer())
        .put('/departments')
        .send({
          name: '開発部',
        })
        .expect(400);
    });

    it('異常系: 存在しないIDの場合は404エラー', async () => {
      await request(app.getHttpServer())
        .put('/departments')
        .send({
          id: 'non-existent-id',
          name: '開発部',
        })
        .expect(404);
    });

    it('異常系: 名前が空文字の場合は400エラー', async () => {
      const department = await prisma.department.create({
        data: {
          name: '開発部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await request(app.getHttpServer())
        .put('/departments')
        .send({
          id: department.id,
          name: '',
        })
        .expect(400);

      await prisma.department.delete({ where: { id: department.id } });
    });
  });

  describe('DELETE /departments/:id', () => {
    it('正常系: 部署を削除できる', async () => {
      const department = await prisma.department.create({
        data: {
          name: '開発部',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await request(app.getHttpServer())
        .delete(`/departments/${department.id}`)
        .expect(204);

      const deleted = await prisma.department.findUnique({
        where: { id: department.id },
      });
      expect(deleted).toBeNull();
    });

    it('異常系: ルートが不正な場合は404エラー', async () => {
      await request(app.getHttpServer()).delete('/departments/').expect(404);
    });

    it('異常系: 存在しないIDの場合は404エラー', async () => {
      await request(app.getHttpServer())
        .delete('/departments/non-existent-id')
        .expect(404);
    });

    it('異常系: ユーザーが紐づいている部署は削除できない', async () => {
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
          firstName: 'テスト',
          lastName: 'ユーザー',
          role: 'user',
          departmentId: department.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await request(app.getHttpServer())
        .delete(`/departments/${department.id}`)
        .expect(400);

      await prisma.user.deleteMany();
      await prisma.department.delete({ where: { id: department.id } });
    });
  });
});
