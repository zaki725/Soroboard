import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { CompanyEntity } from '../../domain/company/company.entity';
import { ICompanyRepository } from '../../domain/company/company.repository.interface';
import { CompanyMapper } from '../../domain/company/company.mapper';
import { handlePrismaError } from '../../../common/utils/prisma-error-handler';
import { CustomLoggerService } from '../../../config/custom-logger.service';

@Injectable()
export class CompanyRepository implements ICompanyRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(company: CompanyEntity): Promise<CompanyEntity> {
    const companyData = await this.prisma.company.create({
      data: CompanyMapper.toPersistence(company),
    });

    return CompanyMapper.toDomain(companyData);
  }

  async update(company: CompanyEntity): Promise<CompanyEntity> {
    try {
      const companyData = await this.prisma.company.update({
        where: { id: company.id },
        data: CompanyMapper.toUpdatePersistence(company),
      });

      return CompanyMapper.toDomain(companyData);
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error : new Error(String(error)),
        undefined,
        'CompanyRepository',
      );
      handlePrismaError(error, {
        resourceName: '会社',
        id: company.id || '',
      });
      throw error; // 到達不能コード（型チェック用）
    }
  }

  async findOne({ id }: { id: string }): Promise<CompanyEntity | null> {
    const companyData = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!companyData) {
      return null;
    }

    return CompanyMapper.toDomain(companyData);
  }
}
