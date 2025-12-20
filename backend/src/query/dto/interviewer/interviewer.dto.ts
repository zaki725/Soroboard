import { ApiProperty } from '@nestjs/swagger';
import type { InterviewerCategory } from '../../../common/enums';
import { INTERVIEWER_CATEGORIES } from '../../../common/enums';

export class InterviewerResponseDto {
  constructor(props: {
    userId: string;
    category: InterviewerCategory;
    userName?: string;
    userEmail?: string;
  }) {
    this.userId = props.userId;
    this.category = props.category;
    // 必須ではない場合は空文字、あるいは undefined のままにするか方針を決める
    // ここでは "データがないなら空文字" としています
    this.userName = props.userName ?? '';
    this.userEmail = props.userEmail ?? '';
  }

  @ApiProperty({ description: 'ユーザーID（主キー）' })
  userId: string;

  @ApiProperty({ description: 'カテゴリ', enum: INTERVIEWER_CATEGORIES })
  category: InterviewerCategory;

  @ApiProperty({ description: 'ユーザー名' })
  userName: string;

  @ApiProperty({ description: 'メールアドレス' })
  userEmail: string;
}
