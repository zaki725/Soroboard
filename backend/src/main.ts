import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { CustomLoggerService } from './config/custom-logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TraceService } from './common/services/trace.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { Pool } from 'pg';
import {
  SESSION_MAX_AGE_MS,
  SESSION_SECRET_REQUIRED,
  CORS_ORIGIN_REQUIRED,
} from './common/constants';
import { InternalServerError } from './common/errors/internal-server.error';

// DATABASE_URLが未設定の場合はデフォルト値を設定
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    'postgresql://postgres:postgres@localhost:5433/app?schema=public';
}

// SESSION_SECRETの検証（すべての環境で必須）
if (!process.env.SESSION_SECRET) {
  throw new InternalServerError(SESSION_SECRET_REQUIRED);
}

// CORS_ORIGINの検証（本番環境では必須）
if (process.env.NODE_ENV === 'production' && !process.env.CORS_ORIGIN) {
  throw new InternalServerError(CORS_ORIGIN_REQUIRED);
}

/**
 * DATABASE_URLからschemaパラメータを削除
 * pgのPoolはschemaパラメータを接続オプションとして解釈するため、Prisma用のパラメータを削除する必要がある
 */
function removeSchemaFromConnectionString(connectionString: string): string {
  return connectionString.replace(/\?schema=[^&]*/, '');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(CustomLoggerService);
  const traceService = app.get(TraceService);

  // PostgreSQL接続プールの作成（セッションストア用）
  // schemaパラメータを削除（pgのPoolはPrisma用のパラメータを理解しない）
  const poolConnectionString = removeSchemaFromConnectionString(
    process.env.DATABASE_URL || '',
  );
  const pool = new Pool({
    connectionString: poolConnectionString,
  });

  // connect-pg-simpleのセッションストアを初期化
  const PgSession = connectPgSimple(session);

  // SESSION_SECRETの確定（既にチェック済み）
  const sessionSecret = process.env.SESSION_SECRET!;

  // クロスオリジン対応のためsameSite: 'none'で固定
  // 開発環境ではhttp://localhostを使用するためsecure: falseを許可
  const sameSite: 'none' = 'none';

  // express-sessionの設定
  app.use(
    session({
      store: new PgSession({
        pool: pool,
        tableName: 'session', // Prismaスキーマで定義したテーブル名
        createTableIfMissing: false, // Prismaマイグレーションで管理するためfalse
      }),
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        // 開発環境ではhttp://localhostを使用するためsecure: false
        // 本番環境ではsecure: true（sameSite: 'none'の要件）
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: SESSION_MAX_AGE_MS,
        sameSite: sameSite,
      },
    }),
  );

  // CORS設定（セキュリティのため、originを制限）
  // 本番環境では既にCORS_ORIGINの検証済み
  const corsOrigin =
    process.env.CORS_ORIGIN ||
    (process.env.NODE_ENV === 'production'
      ? undefined // 本番環境では必須なので、ここには来ない
      : 'http://localhost:3000'); // 開発環境用デフォルト
  app.enableCors({
    origin: corsOrigin,
    credentials: true, // セッションクッキーを許可
  });
  app.useGlobalFilters(new GlobalExceptionFilter(logger));
  app.useGlobalInterceptors(new LoggingInterceptor(logger, traceService));

  // シャットダウンフックを有効化（SIGTERM/SIGINTで正常終了）
  app.enableShutdownHooks();

  // アプリケーション終了時にPoolを閉じる
  process.on('SIGTERM', async () => {
    await pool.end();
  });
  process.on('SIGINT', async () => {
    await pool.end();
  });

  // Swagger設定
  const config = new DocumentBuilder()
    .setTitle('採用管理システム API')
    .setDescription('採用管理システム API ドキュメント')
    .setVersion('1.0')
    .addTag('companies', '会社管理API')
    .addTag('users', 'ユーザー管理API')
    .addTag('recruit-years', '年度管理API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  logger.log(`アプリケーションがポート ${port} で起動しました`, 'Bootstrap');
  logger.log(`Swagger UI: http://localhost:${port}/api`, 'Bootstrap');
}
bootstrap().catch((error) => {
  // 起動前のエラーなのでloggerは使用できない
  process.stderr.write(`Error starting server: ${error}\n`);
  process.exit(1);
});
