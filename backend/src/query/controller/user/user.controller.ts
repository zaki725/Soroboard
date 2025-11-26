import { Controller, Get, Query, Param } from '@nestjs/common';
import { UserService } from '../../application/user/user.service';
import { UserListResponseDto } from '../../dto/user/user-list-response.dto';
import { UserResponseDto } from '../../dto/user/user-response.dto';
import {
  userExportQuerySchema,
  type UserExportQueryDto,
} from '../../dto/user/user-export-query.dto';
import {
  userListQuerySchema,
  type UserListQueryDto,
} from '../../dto/user/user-list-query.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('export')
  async export(
    @Query(new ZodValidationPipe(userExportQuerySchema))
    query: UserExportQueryDto,
  ): Promise<UserResponseDto[]> {
    return await this.userService.findManyForExport({
      id: query.id,
      search: query.search,
      role: query.role,
      gender: query.gender,
      departmentId: query.departmentId,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne({ id });
  }

  @Get()
  async findMany(
    @Query(new ZodValidationPipe(userListQuerySchema))
    query: UserListQueryDto,
  ): Promise<UserListResponseDto> {
    return this.userService.findMany({
      page: query.page,
      pageSize: query.pageSize,
      id: query.id,
      search: query.search,
      role: query.role,
      gender: query.gender,
      departmentId: query.departmentId,
    });
  }
}
