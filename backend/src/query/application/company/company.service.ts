import { Injectable } from '@nestjs/common';
import { CompanyDao } from '../../dao/company/company.dao';
import { CompanyResponseDto } from '../../dto/company/company.dto';
import { splitIds } from '../../../common/utils/string.utils';

@Injectable()
export class CompanyService {
  constructor(private readonly companyDao: CompanyDao) {}

  async findAll({
    recruitYearId,
    id,
    search,
  }: {
    recruitYearId: number;
    id?: string;
    search?: string;
  }): Promise<CompanyResponseDto[]> {
    // ID文字列を配列に変換（カンマ/スペース区切り対応）
    const ids = id ? splitIds(id) : undefined;

    const companies = await this.companyDao.findAll({
      recruitYearId,
      ids,
      search,
    });

    return companies;
  }
}
