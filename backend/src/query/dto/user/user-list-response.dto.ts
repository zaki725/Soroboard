import { UserResponseDto } from './user-response.dto';

export class UserListResponseDto {
  constructor({
    users,
    total,
    page,
    pageSize,
  }: {
    users: UserResponseDto[];
    total: number;
    page: number;
    pageSize: number;
  }) {
    this.users = users;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
  }

  users: UserResponseDto[];
  total: number;
  page: number;
  pageSize: number;
}
