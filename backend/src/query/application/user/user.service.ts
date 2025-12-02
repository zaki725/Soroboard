import { Injectable } from '@nestjs/common';
import { UserDao } from '../../dao/user/user.dao';
import { UserResponseDto } from '../../dto/user/user-response.dto';
import { UserListResponseDto } from '../../dto/user/user-list-response.dto';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { splitIds } from '../../../common/utils/string.utils';
import type { UserRole, Gender } from '../../types/user.types';

type FindManyParams = {
  page?: number;
  pageSize?: number;
  id?: string;
  search?: string;
  role?: UserRole;
  gender?: Gender;
  departmentId?: string;
};

@Injectable()
export class UserService {
  constructor(private readonly userDao: UserDao) {}

  async findOne({ id }: { id: string }): Promise<UserResponseDto> {
    const user = await this.userDao.findOne({ id });
    if (!user) {
      throw new NotFoundError('ユーザー', id);
    }
    return user;
  }

  async findMany({
    page = 1,
    pageSize = 10,
    id,
    search,
    role,
    gender,
    departmentId,
  }: FindManyParams): Promise<UserListResponseDto> {
    // ID文字列を配列に変換（カンマ/スペース区切り対応）
    const ids = id ? splitIds(id) : undefined;

    const { users, total } = await this.userDao.findMany({
      page,
      pageSize,
      ids,
      search,
      role,
      gender,
      departmentId,
    });

    const userDtos = users;

    return new UserListResponseDto({
      users: userDtos,
      total,
      page,
      pageSize,
    });
  }

  async findManyForExport({
    id,
    search,
    role,
    gender,
    departmentId,
  }: {
    id?: string;
    search?: string;
    role?: UserRole;
    gender?: Gender;
    departmentId?: string;
  }): Promise<UserResponseDto[]> {
    // ID文字列を配列に変換（カンマ/スペース区切り対応）
    const ids = id ? splitIds(id) : undefined;

    const users = await this.userDao.findManyForExport({
      ids,
      search,
      role,
      gender,
      departmentId,
    });

    return users;
  }
}
