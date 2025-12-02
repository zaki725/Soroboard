import { Module } from '@nestjs/common';
import { CompanyQueryModule } from './company-query.module';
import { CompanyCommandModule } from './company-command.module';

@Module({
  imports: [CompanyQueryModule, CompanyCommandModule],
})
export class CompanyModule {}
