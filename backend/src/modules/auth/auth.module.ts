import { Module } from '@nestjs/common';
import { AuthQueryModule } from './auth-query.module';
import { AuthCommandModule } from './auth-command.module';

@Module({
  imports: [AuthQueryModule, AuthCommandModule],
})
export class AuthModule {}

