import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import type { LoginResponseDto } from '../../../command/dto/auth/auth.dto';

type RequestWithSession = Request & {
  session: {
    user?: LoginResponseDto;
  };
};

@Controller('auth')
export class AuthController {
  @Get('me')
  getMe(@Req() req: RequestWithSession): LoginResponseDto {
    if (!req.session?.user) {
      throw new UnauthorizedException('認証が必要です');
    }

    return req.session.user;
  }
}


