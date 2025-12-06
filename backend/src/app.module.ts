import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './config/logger.module';
import { RecruitYearModule } from './modules/recruit-year/recruit-year.module';
import { UserModule } from './modules/user/user.module';
import { CompanyModule } from './modules/company/company.module';
import { DepartmentModule } from './modules/department/department.module';
import { InterviewerModule } from './modules/interviewer/interviewer.module';
import { UniversityModule } from './modules/university/university.module';
import { FacultyModule } from './modules/faculty/faculty.module';
import { DeviationValueModule } from './modules/deviation-value/deviation-value.module';
import { EducationalBackgroundCommandModule } from './modules/educational-background/educational-background-command.module';
import { EventLocationModule } from './modules/event-location/event-location.module';
import { EventMasterModule } from './modules/event-master/event-master.module';
import { EventModule } from './modules/event/event.module';
import { SearchConditionModule } from './modules/search-condition/search-condition.module';
import { TeacherModule } from './modules/teacher/teacher.module';

@Module({
  imports: [
    LoggerModule,
    PrismaModule,
    RecruitYearModule,
    UserModule,
    CompanyModule,
    DepartmentModule,
    InterviewerModule,
    UniversityModule,
    FacultyModule,
    DeviationValueModule,
    EducationalBackgroundCommandModule,
    EventLocationModule,
    EventMasterModule,
    EventModule,
    SearchConditionModule,
    TeacherModule,
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
