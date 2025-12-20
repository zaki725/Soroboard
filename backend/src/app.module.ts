import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './config/logger.module';
import { RecruitYearModule } from './modules/recruit-year/recruit-year.module';
import { UserModule } from './modules/user/user.module';
import { SearchConditionModule } from './modules/search-condition/search-condition.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    LoggerModule,
    PrismaModule,
    RecruitYearModule,
    UserModule,
    SearchConditionModule,
    TeacherModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  // ロギングは LoggingInterceptor で処理されるため、ミドルウェアは不要
  // 認証ミドルウェアを適用する場合は、NestModule を実装して configure メソッドを追加
  // 例: /api/protected/* のパスに認証を必須とする場合
  // import { NestModule, MiddlewareConsumer } from '@nestjs/common';
  // import { AuthMiddleware } from './common/middleware/auth.middleware';
  // export class AppModule implements NestModule {
  //   configure(consumer: MiddlewareConsumer) {
  //     consumer.apply(AuthMiddleware).forRoutes('api/protected/*');
  //   }
  // }
}
