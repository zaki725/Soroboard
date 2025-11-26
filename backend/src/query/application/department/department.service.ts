import { Injectable } from '@nestjs/common';
import { DepartmentDao } from '../../dao/department/department.dao';
import { DepartmentResponseDto } from '../../dto/department/department.dto';
import { splitIds } from '../../../common/utils/string.utils';

@Injectable()
export class DepartmentService {
  constructor(private readonly departmentDao: DepartmentDao) {}

  async findAll({
    id,
    search,
  }: {
    id?: string;
    search?: string;
  }): Promise<DepartmentResponseDto[]> {
    // ID文字列を配列に変換（カンマ/スペース区切り対応）
    const ids = id ? splitIds(id) : undefined;

    const departments = await this.departmentDao.findAll({
      ids,
      search,
    });

    return departments;
  }
}
