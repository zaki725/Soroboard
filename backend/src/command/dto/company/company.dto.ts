import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { REQUIRED_FIELD, INVALID } from '../../../common/constants';

export class UpdateCompanyRequestDto {
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

export class CreateCompanyRequestDto {
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

const companyRequestSchemaObject = {
  name: z.string().min(1, REQUIRED_FIELD('会社名')),
  phoneNumber: z.union([z.string(), z.null()]).optional(),
  email: z
    .union([z.string().email(INVALID.EMAIL_FORMAT), z.literal(''), z.null()])
    .optional(),
  websiteUrl: z
    .union([z.string().url(INVALID.URL_FORMAT), z.literal(''), z.null()])
    .optional(),
  recruitYearId: z.number().int().positive(),
};

export const updateCompanyRequestSchema = z.object({
  id: z.string().min(1, REQUIRED_FIELD('ID')),
  ...companyRequestSchemaObject,
});

export const createCompanyRequestSchema = z.object(companyRequestSchemaObject);
