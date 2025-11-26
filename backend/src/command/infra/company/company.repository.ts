import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CompanyEntity } from '../../domain/company/company.entity';
import { ICompanyRepository } from '../../domain/company/company.repository.interface';
import { CompanyMapper } from '../../domain/company/company.mapper';
import { NotFoundError } from '../../../common/errors/not-found.error';

@Injectable()
export class CompanyRepository implements ICompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

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
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('会社', company.id);
      }
      throw error;
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
