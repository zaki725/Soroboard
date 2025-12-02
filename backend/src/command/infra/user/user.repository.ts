import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { User } from '@prisma/client';
import { IUserRepository } from '../../domain/user/user.repository.interface';
import { UserEntity } from '../../domain/user/user.entity';
import { UserMapper } from '../../domain/user/user.mapper';
import { getEntityIdRequired } from '../../../common/constants';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: UserEntity): Promise<User> {
    return this.prisma.user.create({
      data: UserMapper.toPersistence(user),
    });
  }

  async update(user: UserEntity): Promise<User> {
    if (!user.id) {
      throw new Error(getEntityIdRequired('User'));
    }
    return this.prisma.user.update({
      where: { id: user.id },
      data: UserMapper.toUpdatePersistence(user),
    });
  }

  async findById(id: string): Promise<UserEntity | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userData) {
      return null;
    }

    // Mapperを使用してエンティティに変換
    return UserMapper.toDomain(userData);
  }
}
