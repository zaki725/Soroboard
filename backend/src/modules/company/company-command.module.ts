import { Module } from '@nestjs/common';
import { CompanyController } from '../../command/controller/company/company.controller';
import { CompanyService } from '../../command/application/company/company.service';
import { CompanyRepository } from '../../command/infra/company/company.repository';
import { CompanyDao } from '../../query/dao/company/company.dao';
import { INJECTION_TOKENS } from '../../command/constants/injection-tokens';

@Module({
  controllers: [CompanyController],
  providers: [
    CompanyService,
    {
      provide: INJECTION_TOKENS.ICompanyRepository,
      useClass: CompanyRepository,
    },
    CompanyDao,
  ],
})
export class CompanyCommandModule {}
