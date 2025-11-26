import { Controller, Post, Put, Body, Param } from '@nestjs/common';
import { z } from 'zod';
import { UserService } from '../../application/user/user.service';
import type {
  CreateUserRequestDto,
  UpdateUserRequestDto,
} from '../../dto/user/user.dto';
import {
  createUserRequestSchema,
  updateUserRequestBodySchema,
} from '../../dto/user/user.dto';
import type { BulkCreateUserRequestDto } from '../../dto/user/user-bulk.dto';
import { bulkCreateUserRequestSchema } from '../../dto/user/user-bulk.dto';
import { UserResponseDto } from '../../../query/dto/user/user-response.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createUserRequestSchema))
    dto: CreateUserRequestDto,
  ): Promise<UserResponseDto> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return this.userService.create({
      email: dto.email,
      role: dto.role,
      firstName: dto.firstName,
      lastName: dto.lastName,
      gender: dto.gender,
      departmentId: dto.departmentId,
      userId,
    });
  }

  @Put(':id')
  async update(
    @Param(
      'id',
      new ZodValidationPipe(z.string().min(1, 'ユーザーIDは必須です')),
    )
    id: string,
    @Body(new ZodValidationPipe(updateUserRequestBodySchema))
    body: Omit<UpdateUserRequestDto, 'id'>,
  ): Promise<UserResponseDto> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return this.userService.update({
      id,
      email: body.email,
      role: body.role,
      firstName: body.firstName,
      lastName: body.lastName,
      gender: body.gender,
      departmentId: body.departmentId,
      userId,
    });
  }

  @Post('bulk')
  async bulkCreate(
    @Body(new ZodValidationPipe(bulkCreateUserRequestSchema))
    dto: BulkCreateUserRequestDto,
  ): Promise<UserResponseDto[]> {
    // TODO: 認証情報からuserIdを取得（現在はスタブ）
    const userId = 'system';

    return await this.userService.bulkCreate({
      users: dto.users,
      userId,
    });
  }
}
