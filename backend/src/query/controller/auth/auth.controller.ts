import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import type { LoginResponseDto } from '../../../command/dto/auth/auth.dto';
import { UnauthorizedError } from '../../../common/errors/unauthorized.error';
import { AUTHENTICATION_REQUIRED } from '../../../common/constants';

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
      throw new UnauthorizedError(AUTHENTICATION_REQUIRED);
    }

    return req.session.user;
  }
}


