import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { Pool } from 'pg';
import { AuthUserRole, TeacherRole } from '@prisma/client';
import { AuthCommandModule } from '../../../modules/auth/auth-command.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { LoggerModule } from '../../../config/logger.module';
import { PrismaService } from '../../../prisma.service';
import { SESSION_MAX_AGE_MS } from '../../../common/constants';

// DATABASE_URLが未設定の場合はデフォルト値を設定
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    'postgresql://postgres:postgres@localhost:5433/app?schema=public';
}

// SESSION_SECRETが未設定の場合はデフォルト値を設定
if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET = 'test-session-secret';
}

// テスト用の固定パスワードハッシュ（cost=4で生成）
// パスワード: "password123"
const TEST_PASSWORD_HASH =
  '$2b$04$8R1Q2A4kJ/sSm.mkQwYDK.mZTGFLxyqbTO3uN4flOi.jFfsjVt6PW';

describe('AuthController (Command) (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let pool: Pool;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, LoggerModule, AuthCommandModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // セッション設定（テスト用）
    const poolConnectionString = process.env.DATABASE_URL?.replace(
      /\?schema=[^&]*/,
      '',
    ) || 'postgresql://postgres:postgres@localhost:5433/app';
    pool = new Pool({
      connectionString: poolConnectionString,
    });
    const PgSession = connectPgSimple(session);

    app.use(
      session({
        store: new PgSession({
          pool: pool,
          tableName: 'session',
          createTableIfMissing: false,
        }),
        secret: process.env.SESSION_SECRET || 'test-session-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          httpOnly: true,
          maxAge: SESSION_MAX_AGE_MS,
          sameSite: 'none',
        },
      }),
    );

    await app.init();

    prisma = app.get(PrismaService);
  });

  afterEach(async () => {
    // テスト後にクリーンアップ
    try {
      await prisma.authUser.deleteMany();
      await prisma.teacher.deleteMany();
      await prisma.school.deleteMany();
    } catch {
      // テーブルが存在しない場合は無視
    }
    if (pool) {
      await pool.end();
    }
    if (app) {
      await app.close();
    }
  });

  describe('POST /auth/login', () => {
    it('正常系: 正しい認証情報でログイン成功', async () => {
      const password = 'password123';

      // Schoolを作成
      const school = await prisma.school.create({
        data: {
          name: 'テスト学校',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      // Teacherを作成
      await prisma.teacher.create({
        data: {
          email: 'test@example.com',
          roleInSchool: TeacherRole.STAFF,
          firstName: '太郎',
          lastName: '山田',
          schoolId: school.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const authUser = await prisma.authUser.create({
        data: {
          email: 'test@example.com',
          passwordHash: TEST_PASSWORD_HASH,
          role: AuthUserRole.TEACHER,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: password,
        })
        .expect(200);

      expect(response.body).toMatchObject({
        id: authUser.id,
        email: authUser.email,
        role: authUser.role,
        firstName: '太郎',
        lastName: '山田',
      });
    });

    it('正常系: ログイン成功時にセッションCookieが設定される', async () => {
      const password = 'password123';

      // Schoolを作成
      const school = await prisma.school.create({
        data: {
          name: 'テスト学校',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      // Teacherを作成
      await prisma.teacher.create({
        data: {
          email: 'test@example.com',
          roleInSchool: TeacherRole.STAFF,
          firstName: '太郎',
          lastName: '山田',
          schoolId: school.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.authUser.create({
        data: {
          email: 'test@example.com',
          passwordHash: TEST_PASSWORD_HASH,
          role: AuthUserRole.TEACHER,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: password,
        })
        .expect(200);

      // セッションCookieが設定されていることを確認
      const setCookieHeader = response.headers['set-cookie'];
      expect(setCookieHeader).toBeDefined();
      // supertestではset-cookieは配列として返される
      if (Array.isArray(setCookieHeader)) {
        expect(setCookieHeader.length).toBeGreaterThan(0);
        expect(setCookieHeader[0]).toContain('connect.sid');
      } else if (typeof setCookieHeader === 'string') {
        expect(setCookieHeader).toContain('connect.sid');
      } else {
        // 配列でも文字列でもない場合はエラー
        expect(setCookieHeader).toBeInstanceOf(Array);
      }
    });

    it('異常系: ユーザーが存在しない場合に401エラーが返る', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'notfound@example.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body).toMatchObject({
        statusCode: 401,
        message: 'メールアドレスまたはパスワードが正しくありません',
      });
    });

    it('異常系: パスワードが間違っている場合に401エラーが返る', async () => {
      // Schoolを作成
      const school = await prisma.school.create({
        data: {
          name: 'テスト学校',
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      // Teacherを作成
      await prisma.teacher.create({
        data: {
          email: 'test@example.com',
          roleInSchool: TeacherRole.STAFF,
          firstName: '太郎',
          lastName: '山田',
          schoolId: school.id,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      await prisma.authUser.create({
        data: {
          email: 'test@example.com',
          passwordHash: TEST_PASSWORD_HASH,
          role: AuthUserRole.TEACHER,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrong-password',
        })
        .expect(401);

      expect(response.body).toMatchObject({
        statusCode: 401,
        message: 'メールアドレスまたはパスワードが正しくありません',
      });
    });

    it('異常系: メールアドレス形式が不正な場合に400エラーが返る', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('異常系: パスワードが空の場合に400エラーが返る', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: '',
        })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });
  });
});

