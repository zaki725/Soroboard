import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FacultyService } from '../../application/faculty/faculty.service';
import { FacultyResponseDto } from '../../dto/faculty/faculty.dto';
import { z } from 'zod';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';

const universityIdParamSchema = z.string().min(1, '大学IDは必須です');

@ApiTags('faculties')
@Controller('universities/:universityId/faculties')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Get()
  @ApiOperation({ summary: '大学に紐づく学部一覧を取得' })
  @ApiParam({ name: 'universityId', description: '大学ID' })
  @ApiResponse({
    status: 200,
    description: '学部一覧を取得しました',
    type: [FacultyResponseDto],
  })
  @ApiResponse({ status: 400, description: 'リクエストが不正です' })
  async findAllByUniversityId(
    @Param('universityId', new ZodValidationPipe(universityIdParamSchema))
    universityId: string,
  ): Promise<FacultyResponseDto[]> {
    return this.facultyService.findAllByUniversityId({ universityId });
  }
}
