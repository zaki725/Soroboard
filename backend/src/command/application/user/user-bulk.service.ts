import { Injectable, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/user/user.repository.interface';
import { UserEntity } from '../../domain/user/user.entity';
import { UserResponseDto } from '../../../query/dto/user/user-response.dto';
import { UserDao } from '../../../query/dao/user/user.dao';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';
import type { UserRole, Gender } from '../../domain/user/user.types';
import type { User } from '@prisma/client';

@Injectable()
export class UserBulkService {
  constructor(
    @Inject(INJECTION_TOKENS.IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly userDao: UserDao,
  ) {}

  async bulkCreate(params: {
    users: {
      email: string;
      role: UserRole;
      firstName: string;
      lastName: string;
      gender: Gender | null;
      departmentId: string;
    }[];
    userId: string;
  }): Promise<UserResponseDto[]> {
    // Promise.allSettledを使用して、一部のユーザーが失敗しても続行
    const results = await Promise.allSettled(
      params.users.map((userData) => {
        const userEntity = UserEntity.create({
          email: userData.email,
          role: userData.role,
          firstName: userData.firstName,
          lastName: userData.lastName,
          gender: userData.gender,
          departmentId: userData.departmentId,
          createdBy: params.userId,
          updatedBy: params.userId,
        });
        return this.userRepository.create(userEntity);
      }),
    );

    // 成功したユーザーのみを取得
    const createdUsers: User[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        createdUsers.push(result.value);
      }
      // rejectedの場合はスキップ（重複エラーなど）
    }

    if (createdUsers.length === 0) {
      return [];
    }

    // バッチクエリで一括取得してパフォーマンスを改善
    const userIds = createdUsers.map((user) => user.id);
    const usersWithRelations = await this.userDao.findMany({
      ids: userIds,
      pageSize: userIds.length,
    });

    // データ不整合を検知するため、エラーはそのまま伝播させる
    return usersWithRelations.users;
  }
}
