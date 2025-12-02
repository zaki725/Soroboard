import { CompanyEntity } from './company.entity';

export interface ICompanyRepository {
  create(company: CompanyEntity): Promise<CompanyEntity>;
  update(company: CompanyEntity): Promise<CompanyEntity>;
  findOne({ id }: { id: string }): Promise<CompanyEntity | null>;
}
