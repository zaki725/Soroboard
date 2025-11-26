import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { REQUIRED_FIELD } from '../../../common/constants';

export class UpdateDepartmentRequestDto {
  @ApiProperty({ description: '部署ID' })
  id: string;

  @ApiProperty({ description: '部署名' })
  name: string;
}

export class CreateDepartmentRequestDto {
  @ApiProperty({ description: '部署名' })
  name: string;
}

export const updateDepartmentRequestSchema = z.object({
  id: z.string().min(1, REQUIRED_FIELD('ID')),
  name: z.string().min(1, REQUIRED_FIELD('部署名')),
});

export const createDepartmentRequestSchema = z.object({
  name: z.string().min(1, REQUIRED_FIELD('部署名')),
});

export class DeleteDepartmentRequestDto {
  @ApiProperty({ description: '部署ID' })
  id: string;
}

export const deleteDepartmentRequestSchema = z.object({
  id: z.string().min(1, REQUIRED_FIELD('ID')),
});
