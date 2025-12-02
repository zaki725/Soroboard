import { Module } from '@nestjs/common';
import { UserQueryModule } from './user-query.module';
import { UserCommandModule } from './user-command.module';

@Module({
  imports: [UserQueryModule, UserCommandModule],
})
export class UserModule {}
