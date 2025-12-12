import { Module } from '@nestjs/common';
import { AuthUserDao } from '../../query/dao/auth-user/auth-user.dao';

@Module({
  controllers: [],
  providers: [AuthUserDao],
})
export class AuthQueryModule {}

