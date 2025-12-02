import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UniversityService } from '../../application/university/university.service';
import { UniversityResponseDto } from '../../dto/university/university.dto';
import {
  universityListQuerySchema,
  type UniversityListQueryDto,
} from '../../dto/university/university-list-query.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';

@ApiTags('universities')
@Controller('universities')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Get()
  @ApiOperation({ summary: '大学一覧を取得' })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'ID（カンマ/スペース区切り可）',
  })
  @ApiQuery({ name: 'search', required: false, description: '検索キーワード' })
  @ApiQuery({
    name: 'rank',
    required: false,
    description: '学校ランク（S, A, B, C, D）',
    enum: ['S', 'A', 'B', 'C', 'D'],
  })
  @ApiResponse({
    status: 200,
    description: '大学一覧を取得しました',
    type: [UniversityResponseDto],
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async findAll(
    @Query(new ZodValidationPipe(universityListQuerySchema))
    query: UniversityListQueryDto,
  ): Promise<UniversityResponseDto[]> {
    return this.universityService.findAll({
      id: query.id,
      search: query.search,
      rank: query.rank,
    });
  }
}
