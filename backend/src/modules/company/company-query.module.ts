import { Module } from '@nestjs/common';
import { CompanyController } from '../../query/controller/company/company.controller';
import { CompanyService } from '../../query/application/company/company.service';
import { CompanyDao } from '../../query/dao/company/company.dao';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, CompanyDao],
})
export class CompanyQueryModule {}
