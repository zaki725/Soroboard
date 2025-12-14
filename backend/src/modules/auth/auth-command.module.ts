import { Module } from '@nestjs/common';
import { AuthController } from '../../command/controller/auth/auth.controller';
import { AuthService } from '../../command/application/auth/auth.service';
import { AuthUserRepository } from '../../command/infra/auth/auth-user.repository';
import { BcryptPasswordHasher } from '../../command/infra/auth/bcrypt-password-hasher';
import { INJECTION_TOKENS } from '../../command/constants/injection-tokens';
import { TeacherCommandModule } from '../teacher/teacher-command.module';

@Module({
  imports: [TeacherCommandModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: INJECTION_TOKENS.IAuthUserRepository,
      useClass: AuthUserRepository,
    },
    {
      provide: INJECTION_TOKENS.PasswordHasher,
      useClass: BcryptPasswordHasher,
    },
  ],
})
export class AuthCommandModule {}

