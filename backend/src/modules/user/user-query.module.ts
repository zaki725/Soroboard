import { Module } from '@nestjs/common';
import { UserController } from '../../query/controller/user/user.controller';
import { UserService } from '../../query/application/user/user.service';
import { UserDao } from '../../query/dao/user/user.dao';

@Module({
  controllers: [UserController],
  providers: [UserService, UserDao],
})
export class UserQueryModule {}
