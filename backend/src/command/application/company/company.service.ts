import { Injectable, Inject } from '@nestjs/common';
import type { ICompanyRepository } from '../../domain/company/company.repository.interface';
import { CompanyEntity } from '../../domain/company/company.entity';
import { CompanyResponseDto } from '../../../query/dto/company/company.dto';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { NotFoundError } from '../../../common/errors/not-found.error';
import { CREATE, UPDATE } from '../../../common/constants';

type CreateParams = {
  name: string;
  phoneNumber: string | null;
  email: string | null;
  websiteUrl: string | null;
  recruitYearId: number;
  userId: string;
};

type UpdateParams = {
  id: string;
  name: string;
  phoneNumber: string | null;
  email: string | null;
  websiteUrl: string | null;
  recruitYearId: number;
  userId: string;
};

@Injectable()
export class CompanyService {
  constructor(
    @Inject(INJECTION_TOKENS.ICompanyRepository)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async create(params: CreateParams): Promise<CompanyResponseDto> {
    if (!params.userId) {
      throw new BadRequestError(CREATE.USER_ID_REQUIRED);
    }

    const companyEntity = CompanyEntity.create({
      name: params.name,
      phoneNumber: params.phoneNumber,
      email: params.email,
      websiteUrl: params.websiteUrl,
      recruitYearId: params.recruitYearId,
      createdBy: params.userId,
      updatedBy: params.userId,
    });

    const created = await this.companyRepository.create(companyEntity);
    const createdWithId: CompanyEntity & { id: string } =
      created as CompanyEntity & { id: string };
    createdWithId.ensureId();
    return new CompanyResponseDto({
      id: createdWithId.id,
      name: createdWithId.name,
      phoneNumber: createdWithId.phoneNumber,
      email: createdWithId.email,
      websiteUrl: createdWithId.websiteUrl,
      recruitYearId: createdWithId.recruitYearId,
    });
  }

  async update(params: UpdateParams): Promise<CompanyResponseDto> {
    if (!params.id) {
      throw new BadRequestError(UPDATE.ID_REQUIRED);
    }

    if (!params.userId) {
      throw new BadRequestError(UPDATE.USER_ID_REQUIRED);
    }

    const existingCompany = await this.companyRepository.findOne({
      id: params.id,
    });

    if (!existingCompany) {
      throw new NotFoundError('会社', params.id);
    }

    // エンティティの振る舞いメソッドを使用して更新
    existingCompany.updateProfile({
      name: params.name,
      websiteUrl: params.websiteUrl,
      updatedBy: params.userId,
    });

    existingCompany.changeContactInfo({
      email: params.email,
      phoneNumber: params.phoneNumber,
      updatedBy: params.userId,
    });

    const updated = await this.companyRepository.update(existingCompany);
    const updatedWithId: CompanyEntity & { id: string } =
      updated as CompanyEntity & { id: string };
    updatedWithId.ensureId();
    return new CompanyResponseDto({
      id: updatedWithId.id,
      name: updatedWithId.name,
      phoneNumber: updatedWithId.phoneNumber,
      email: updatedWithId.email,
      websiteUrl: updatedWithId.websiteUrl,
      recruitYearId: updatedWithId.recruitYearId,
    });
  }
}
