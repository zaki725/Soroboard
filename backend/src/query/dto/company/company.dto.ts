import { ApiProperty } from '@nestjs/swagger';

export class CompanyResponseDto {
  constructor(partial: Partial<CompanyResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: '会社ID' })
  id: string;

  @ApiProperty({ description: '会社名' })
  name: string;

  @ApiProperty({ description: '電話番号', nullable: true, required: false })
  phoneNumber: string | null;

  @ApiProperty({
    description: 'メールアドレス',
    nullable: true,
    required: false,
  })
  email: string | null;

  @ApiProperty({ description: 'WEBサイトURL', nullable: true, required: false })
  websiteUrl: string | null;

  @ApiProperty({ description: '年度ID' })
  recruitYearId: number;
}
