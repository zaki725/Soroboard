import { Controller, Get } from '@nestjs/common';
import { RecruitYearService } from '../../application/recruit-year/recruit-year.service';
import { RecruitYearResponseDto } from '../../dto/recruit-year/recruit-year.dto';

@Controller('recruit-years')
export class RecruitYearController {
  constructor(private readonly recruitYearService: RecruitYearService) {}

  @Get()
  async findAll(): Promise<RecruitYearResponseDto[]> {
    return this.recruitYearService.findAll();
  }
}
