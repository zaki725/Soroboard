import { Injectable, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/user/user.repository.interface';
import { UserEntity } from '../../domain/user/user.entity';
import { UserResponseDto } from '../../../query/dto/user/user-response.dto';
import { UserDao } from '../../../query/dao/user/user.dao';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';
import type { UserRole, Gender } from '../../domain/user/user.types';
import { InternalServerError } from '../../../common/errors/internal-server.error';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { UserBulkService } from './user-bulk.service';

type CreateParams = {
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  gender: Gender | null;
  departmentId: string;
  userId: string;
};

type UpdateParams = {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  gender: Gender | null;
  departmentId: string;
  userId: string;
};

type BulkCreateParams = {
  users: {
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    gender: Gender | null;
    departmentId: string;
  }[];
  userId: string;
};

@Injectable()
export class UserService {
  constructor(
    @Inject(INJECTION_TOKENS.IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly userDao: UserDao,
    private readonly userBulkService: UserBulkService,
  ) {}

  async create(params: CreateParams): Promise<UserResponseDto> {
    const userEntity = UserEntity.create({
      email: params.email,
      role: params.role,
      firstName: params.firstName,
      lastName: params.lastName,
      gender: params.gender,
      departmentId: params.departmentId,
      createdBy: params.userId,
      updatedBy: params.userId,
    });
    const created = await this.userRepository.create(userEntity);
    // Query側のDAOを使って完全な情報を取得
    const userWithRelations = await this.userDao.findOne({ id: created.id });
    if (!userWithRelations) {
      throw new InternalServerError(
        'ユーザー情報の取得に失敗しました。データの整合性に問題があります。',
      );
    }

    return userWithRelations;
  }

  async update(params: UpdateParams): Promise<UserResponseDto> {
    // Repositoryからエンティティとして直接取得
    const userEntity: UserEntity | null = await this.userRepository.findById(
      params.id,
    );

    if (!userEntity) {
      throw new NotFoundError('ユーザー', params.id);
    }

    // エンティティの振る舞いメソッドを使用して更新
    // 値が変わったかどうかの判定はエンティティ側で処理する
    userEntity.changeEmail({
      email: params.email,
      updatedBy: params.userId,
    });

    userEntity.changeRole({
      role: params.role,
      updatedBy: params.userId,
    });

    userEntity.updateProfile({
      firstName: params.firstName,
      lastName: params.lastName,
      gender: params.gender,
      updatedBy: params.userId,
    });

    userEntity.changeDepartment({
      departmentId: params.departmentId,
      updatedBy: params.userId,
    });

    // 保存
    await this.userRepository.update(userEntity);

    // DAO経由で最新の表示用データを取得して返す
    const userWithRelations = await this.userDao.findOne({ id: params.id });
    if (!userWithRelations) {
      throw new InternalServerError(
        'ユーザー情報の取得に失敗しました。データの整合性に問題があります。',
      );
    }
    return userWithRelations;
  }

  async bulkCreate(params: BulkCreateParams): Promise<UserResponseDto[]> {
    return this.userBulkService.bulkCreate(params);
  }
}
