import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { INJECTION_TOKENS } from '../../constants/injection-tokens';
import { ICompanyRepository } from '../../domain/company/company.repository.interface';
import { CompanyEntity } from '../../domain/company/company.entity';
import { BadRequestError } from '../../../common/errors/bad-request.error';
import { DomainError } from '../../../common/errors/domain.error';

describe('CompanyService', () => {
  let service: CompanyService;
  let repository: ICompanyRepository;

  beforeEach(async () => {
    const mockRepository: ICompanyRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: INJECTION_TOKENS.ICompanyRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    repository = module.get<ICompanyRepository>(
      INJECTION_TOKENS.ICompanyRepository,
    );
  });

  describe('create', () => {
    it('正常系: 会社を作成できる', async () => {
      const entity = CompanyEntity.create({
        id: 'test-id',
        name: 'テスト株式会社',
        phoneNumber: '03-1234-5678',
        email: 'test@example.com',
        websiteUrl: 'https://example.com',
        recruitYearId: 2024,
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const createSpy = jest
        .spyOn(repository, 'create')
        .mockResolvedValue(entity);

      const result = await service.create({
        name: 'テスト株式会社',
        phoneNumber: '03-1234-5678',
        email: 'test@example.com',
        websiteUrl: 'https://example.com',
        recruitYearId: 2024,
        userId: 'system',
      });

      expect(result).toMatchObject({
        id: entity.id,
        name: entity.name,
        phoneNumber: entity.phoneNumber,
        email: entity.email,
        websiteUrl: entity.websiteUrl,
        recruitYearId: entity.recruitYearId,
      });
      expect(createSpy).toHaveBeenCalled();
    });

    it('異常系: userIdが不足している場合はエラー', async () => {
      await expect(
        service.create({
          name: 'テスト株式会社',
          phoneNumber: null,
          email: null,
          websiteUrl: null,
          recruitYearId: 2024,
          userId: '',
        }),
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe('update', () => {
    it('正常系: 会社を更新できる', async () => {
      const entity = CompanyEntity.create({
        id: 'test-id',
        name: '更新テスト株式会社',
        phoneNumber: '03-9876-5432',
        email: 'updated@example.com',
        websiteUrl: 'https://updated.com',
        recruitYearId: 2024,
        createdBy: 'system',
        updatedBy: 'updated-user',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(repository, 'findOne').mockResolvedValue(entity);

      const updateSpy = jest
        .spyOn(repository, 'update')
        .mockResolvedValue(entity);

      const result = await service.update({
        id: 'test-id',
        name: '更新テスト株式会社',
        phoneNumber: '03-9876-5432',
        email: 'updated@example.com',
        websiteUrl: 'https://updated.com',
        recruitYearId: 2024,
        userId: 'updated-user',
      });

      expect(result).toMatchObject({
        id: entity.id,
        name: entity.name,
        phoneNumber: entity.phoneNumber,
        email: entity.email,
        websiteUrl: entity.websiteUrl,
        recruitYearId: entity.recruitYearId,
      });
      expect(updateSpy).toHaveBeenCalled();
    });

    it('異常系: IDが不足している場合はエラー', async () => {
      await expect(
        service.update({
          id: '',
          name: 'テスト株式会社',
          phoneNumber: null,
          email: null,
          websiteUrl: null,
          recruitYearId: 2024,
          userId: 'system',
        }),
      ).rejects.toThrow(BadRequestError);
    });

    it('異常系: userIdが不足している場合はエラー', async () => {
      await expect(
        service.update({
          id: 'test-id',
          name: 'テスト株式会社',
          phoneNumber: null,
          email: null,
          websiteUrl: null,
          recruitYearId: 2024,
          userId: '',
        }),
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe('toResponseDto', () => {
    it('異常系: IDがないEntityの場合はエラー', async () => {
      const entity = CompanyEntity.create({
        name: 'テスト株式会社',
        phoneNumber: null,
        email: null,
        websiteUrl: null,
        recruitYearId: 2024,
        createdBy: 'system',
        updatedBy: 'system',
      });

      jest.spyOn(repository, 'create').mockResolvedValue(entity);

      await expect(
        service.create({
          name: 'テスト株式会社',
          phoneNumber: null,
          email: null,
          websiteUrl: null,
          recruitYearId: 2024,
          userId: 'system',
        }),
      ).rejects.toThrow(DomainError);
    });
  });
});
