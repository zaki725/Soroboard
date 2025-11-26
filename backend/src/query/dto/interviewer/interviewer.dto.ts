import { ApiProperty } from '@nestjs/swagger';
import type { InterviewerCategory } from '../../../common/enums';
import { INTERVIEWER_CATEGORIES } from '../../../common/enums';

export class InterviewerResponseDto {
  constructor(props: {
    userId: string;
    category: InterviewerCategory;
    userName?: string;
    userEmail?: string;
    universityId?: string | null; // nullも許容するように型を緩和
    universityName?: string | null;
    facultyId?: string | null;
    facultyName?: string | null;
  }) {
    this.userId = props.userId;
    this.category = props.category;
    // 必須ではない場合は空文字、あるいは undefined のままにするか方針を決める
    // ここでは "データがないなら空文字" としています
    this.userName = props.userName ?? '';
    this.userEmail = props.userEmail ?? '';

    // null check: nullならundefinedに変換してJSONに出力しない、などの制御が可能
    this.universityId = props.universityId ?? undefined;
    this.universityName = props.universityName ?? undefined;
    this.facultyId = props.facultyId ?? undefined;
    this.facultyName = props.facultyName ?? undefined;
  }

  @ApiProperty({ description: 'ユーザーID（主キー）' })
  userId: string;

  @ApiProperty({ description: 'カテゴリ', enum: INTERVIEWER_CATEGORIES })
  category: InterviewerCategory;

  @ApiProperty({ description: 'ユーザー名' })
  userName: string;

  @ApiProperty({ description: 'メールアドレス' })
  userEmail: string;

  @ApiProperty({ description: '出身大学ID', required: false })
  universityId?: string;

  @ApiProperty({ description: '出身大学名', required: false })
  universityName?: string;

  @ApiProperty({ description: '出身学部ID', required: false })
  facultyId?: string;

  @ApiProperty({ description: '出身学部名', required: false })
  facultyName?: string;
}
