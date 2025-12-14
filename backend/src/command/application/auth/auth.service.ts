import { Injectable, Inject } from '@nestjs/common';
import type { IAuthUserRepository } from '../../domain/auth/auth-user.repository.interface';
import type { ITeacherRepository } from '../../domain/teacher/teacher.repository.interface';
import type { PasswordHasher } from '../../domain/auth/password-hasher.interface';
import type { LoginResponseDto } from '../../dto/auth/auth.dto';
import { UnauthorizedError } from '../../../common/errors/unauthorized.error';
import { InternalServerError } from '../../../common/errors/internal-server.error';
import {
  INVALID_CREDENTIALS,
  USER_DATA_INTEGRITY_ERROR,
} from '../../../common/constants';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';

type LoginParams = {
  email: string;
  password: string;
};

/**
 * タイミング攻撃対策用のダミーハッシュ
 * ユーザーが見つからない場合でも、bcrypt.compareを実行して処理時間を一定に保つ
 * 本物のbcryptハッシュ（パスワード "dummy" をハッシュ化したもの）
 */
const DUMMY_HASH =
  '$2b$10$pQ09mWNt.3q00g3Lp03noOavJGP6L2PzCDIieiBid8kHepQVEa9PS';

@Injectable()
export class AuthService {
  constructor(
    @Inject(INJECTION_TOKENS.IAuthUserRepository)
    private readonly authUserRepository: IAuthUserRepository,
    @Inject(INJECTION_TOKENS.ITeacherRepository)
    private readonly teacherRepository: ITeacherRepository,
    @Inject(INJECTION_TOKENS.PasswordHasher)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async login(params: LoginParams): Promise<LoginResponseDto> {
    const authUser = await this.authUserRepository.findByEmail(params.email);

    // タイミング攻撃対策: ユーザーが見つからない場合でも、
    // ダミーハッシュでパスワード検証を実行してからエラーを返す
    // これにより、ユーザーの存在有無による処理時間の差を防ぐ
    const passwordHash = authUser ? authUser.passwordHash : DUMMY_HASH;
    const isPasswordValid = await this.passwordHasher.compare(
      params.password,
      passwordHash,
    );

    if (!authUser || !isPasswordValid) {
      throw new UnauthorizedError(INVALID_CREDENTIALS);
    }

    const teacher = await this.teacherRepository.findByEmail(params.email);
    if (!teacher) {
      throw new InternalServerError(USER_DATA_INTEGRITY_ERROR);
    }

    return {
      id: authUser.id,
      email: authUser.email,
      role: authUser.role,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
    };
  }
}

