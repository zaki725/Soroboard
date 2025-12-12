import { Injectable, Inject } from '@nestjs/common';
import type { IAuthUserRepository } from '../../domain/auth/auth-user.repository.interface';
import { AuthUserEntity } from '../../domain/auth/auth-user.entity';
import type { PasswordHasher } from '../../domain/auth/password-hasher.interface';
import type { LoginResponseDto } from '../../dto/auth/auth.dto';
import { UnauthorizedError } from '../../../common/errors/unauthorized.error';
import { getInvalidCredentials } from '../../../common/constants';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';

type LoginParams = {
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(INJECTION_TOKENS.IAuthUserRepository)
    private readonly authUserRepository: IAuthUserRepository,
    @Inject('PasswordHasher')
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async login(params: LoginParams): Promise<LoginResponseDto> {
    const authUser = await this.authUserRepository.findByEmail(params.email);

    if (!authUser) {
      throw new UnauthorizedError(getInvalidCredentials(params.email));
    }

    const isPasswordValid = await authUser.verifyPassword(
      params.password,
      this.passwordHasher,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError(getInvalidCredentials(params.email));
    }

    return {
      id: authUser.id,
      email: authUser.email,
      role: authUser.role,
    };
  }
}

