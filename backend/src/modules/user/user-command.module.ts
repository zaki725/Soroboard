import { Module } from '@nestjs/common';
import { UserController } from '../../command/controller/user/user.controller';
import { UserService } from '../../command/application/user/user.service';
import { UserBulkService } from '../../command/application/user/user-bulk.service';
import { UserRepository } from '../../command/infra/user/user.repository';
import { UserDao } from '../../query/dao/user/user.dao';
import { INJECTION_TOKENS } from '../../command/constants/injection-tokens';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserBulkService,
    {
      provide: INJECTION_TOKENS.IUserRepository,
      useClass: UserRepository,
    },
    UserDao,
  ],
})
export class UserCommandModule {}
