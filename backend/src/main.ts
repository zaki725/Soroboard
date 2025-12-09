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
import { SESSION_MAX_AGE_MS } from './common/constants';

// DATABASE_URLが未設定の場合はデフォルト値を設定
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    'postgresql://postgres:postgres@localhost:5433/app?schema=public';
  console.log(
    `DATABASE_URL環境変数を設定しました: ${process.env.DATABASE_URL}`,
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(CustomLoggerService);
  const traceService = app.get(TraceService);

  // PostgreSQL接続プールの作成（セッションストア用）
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // connect-pg-simpleのセッションストアを初期化
  const PgSession = connectPgSimple(session);

  // express-sessionの設定
  app.use(
    session({
      store: new PgSession({
        pool: pool,
        tableName: 'session', // Prismaスキーマで定義したテーブル名
        createTableIfMissing: true, // テーブルが存在しない場合は自動作成
      }),
      secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: SESSION_MAX_AGE_MS,
      },
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true, // セッションクッキーを許可
  });
  app.useGlobalFilters(new GlobalExceptionFilter(logger));
  app.useGlobalInterceptors(new LoggingInterceptor(logger, traceService));

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
  console.error('Error starting server:', error);
  process.exit(1);
});
