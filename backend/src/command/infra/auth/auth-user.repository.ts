import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { IAuthUserRepository } from '../../domain/auth/auth-user.repository.interface';
import { AuthUserEntity } from '../../domain/auth/auth-user.entity';
import { AuthUserMapper } from '../../domain/auth/auth-user.mapper';

@Injectable()
export class AuthUserRepository implements IAuthUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<AuthUserEntity | null> {
    const authUserData = await this.prisma.authUser.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });

    if (!authUserData) {
      return null;
    }

    return AuthUserMapper.toDomain(authUserData);
  }
}

