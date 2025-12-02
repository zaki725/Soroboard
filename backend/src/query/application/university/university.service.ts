import { Injectable } from '@nestjs/common';
import { UniversityDao } from '../../dao/university/university.dao';
import { UniversityResponseDto } from '../../dto/university/university.dto';
import { splitIds } from '../../../common/utils/string.utils';
import { UniversityRankLevel } from '@prisma/client';

@Injectable()
export class UniversityService {
  constructor(private readonly universityDao: UniversityDao) {}

  async findAll({
    id,
    search,
    rank,
  }: {
    id?: string;
    search?: string;
    rank?: UniversityRankLevel;
  }): Promise<UniversityResponseDto[]> {
    const ids = id ? splitIds(id) : undefined;

    const universities = await this.universityDao.findAll({
      ids,
      search,
      rank,
    });

    return universities;
  }
}
