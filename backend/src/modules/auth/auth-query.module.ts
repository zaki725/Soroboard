import { Module } from '@nestjs/common';
import { AuthController } from '../../query/controller/auth/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [],
})
export class AuthQueryModule {}

