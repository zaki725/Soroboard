import { ApiProperty } from '@nestjs/swagger';

export class DepartmentResponseDto {
  constructor(partial: Partial<DepartmentResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: '部署ID' })
  id: string;

  @ApiProperty({ description: '部署名' })
  name: string;
}
