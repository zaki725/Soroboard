import { Controller, Post, Body, Req, HttpCode, HttpStatus } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../../application/auth/auth.service';
import type {
  LoginRequestDto,
  LoginSuccessResponseDto,
} from '../../dto/auth/auth.dto';
import { loginRequestSchema } from '../../dto/auth/auth.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';

type RequestWithSession = Request & {
  session: {
    user?: {
      id: string;
      email: string;
      role: string;
    };
    save: (callback?: (err?: Error) => void) => void;
  };
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ZodValidationPipe(loginRequestSchema)) dto: LoginRequestDto,
    @Req() req: RequestWithSession,
  ): Promise<LoginSuccessResponseDto> {
    const user = await this.authService.login({
      email: dto.email,
      password: dto.password,
    });

    // セッションにユーザー情報を保存
    req.session.user = user;

    return {
      message: 'ログインに成功しました',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}

