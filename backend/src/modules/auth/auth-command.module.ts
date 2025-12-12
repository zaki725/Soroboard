import { Module } from '@nestjs/common';
import { AuthController } from '../../command/controller/auth/auth.controller';
import { AuthService } from '../../command/application/auth/auth.service';
import { AuthUserRepository } from '../../command/infra/auth/auth-user.repository';
import { BcryptPasswordHasher } from '../../command/infra/auth/bcrypt-password-hasher';
import { PasswordHasher } from '../../command/domain/auth/password-hasher.interface';
import { INJECTION_TOKENS } from '../../command/constants/injection-tokens';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: INJECTION_TOKENS.IAuthUserRepository,
      useClass: AuthUserRepository,
    },
    AuthUserRepository,
    {
      provide: 'PasswordHasher',
      useClass: BcryptPasswordHasher,
    },
    BcryptPasswordHasher,
  ],
})
export class AuthCommandModule {}

