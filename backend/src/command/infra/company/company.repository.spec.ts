import { Test, TestingModule } from '@nestjs/testing';
import { CompanyRepository } from './company.repository';
import { PrismaService } from '../../../prisma.service';
import { CompanyEntity } from '../../domain/company/company.entity';
import { RecruitYear } from '@prisma/client';

describe('CompanyRepository', () => {
  let repository: CompanyRepository;
  let prisma: PrismaService;
  let recruitYear: RecruitYear;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyRepository, PrismaService],
    }).compile();

    repository = module.get<CompanyRepository>(CompanyRepository);
    prisma = module.get<PrismaService>(PrismaService);

    recruitYear = await prisma.recruitYear.create({
      data: {
        recruitYear: 2024,
        displayName: '2024年度',
        themeColor: '#000000',
        createdBy: 'system',
        updatedBy: 'system',
      },
    });
  });

  afterEach(async () => {
    // テーブルが存在しない場合はエラーを無視
    try {
      await prisma.company.deleteMany();
      await prisma.recruitYear.deleteMany();
    } catch {
      // テーブルが存在しない場合は無視
    }
  });

  describe('create', () => {
    it('正常系: 会社を作成できる', async () => {
      const entity = CompanyEntity.create({
        name: 'テスト株式会社',
        phoneNumber: '03-1234-5678',
        email: 'test@example.com',
        websiteUrl: 'https://example.com',
        recruitYearId: recruitYear.recruitYear,
        createdBy: 'system',
        updatedBy: 'system',
      });

      const result = await repository.create(entity);

      expect(result).toBeInstanceOf(CompanyEntity);
      expect(result.id).toBeDefined();
      expect(result.name).toBe(entity.name);
      expect(result.phoneNumber).toBe(entity.phoneNumber);
      expect(result.email).toBe(entity.email);
      expect(result.websiteUrl).toBe(entity.websiteUrl);
      expect(result.recruitYearId).toBe(entity.recruitYearId);

      const created = await prisma.company.findUnique({
        where: { id: result.id! },
      });
      expect(created).toBeDefined();
    });

    it('正常系: オプショナル項目がnullの場合は作成できる', async () => {
      const entity = CompanyEntity.create({
        name: 'テスト株式会社',
        phoneNumber: null,
        email: null,
        websiteUrl: null,
        recruitYearId: recruitYear.recruitYear,
        createdBy: 'system',
        updatedBy: 'system',
      });

      const result = await repository.create(entity);

      expect(result.phoneNumber).toBeNull();
      expect(result.email).toBeNull();
      expect(result.websiteUrl).toBeNull();
    });
  });

  describe('update', () => {
    it('正常系: 会社を更新できる', async () => {
      const company = await prisma.company.create({
        data: {
          name: 'テスト株式会社',
          recruitYearId: recruitYear.recruitYear,
          createdBy: 'system',
          updatedBy: 'system',
        },
      });

      const entity = CompanyEntity.create({
        id: company.id,
        name: '更新テスト株式会社',
        phoneNumber: '03-9876-5432',
        email: 'updated@example.com',
        websiteUrl: 'https://updated.com',
        recruitYearId: recruitYear.recruitYear,
        createdBy: 'system',
        updatedBy: 'updated-user',
      });

      const result = await repository.update(entity);

      expect(result).toBeInstanceOf(CompanyEntity);
      expect(result.id).toBe(company.id);
      expect(result.name).toBe(entity.name);
      expect(result.phoneNumber).toBe(entity.phoneNumber);
      expect(result.email).toBe(entity.email);
      expect(result.websiteUrl).toBe(entity.websiteUrl);
      expect(result.updatedBy).toBe('updated-user');

      const updated = await prisma.company.findUnique({
        where: { id: company.id },
      });
      expect(updated?.name).toBe(entity.name);
    });

    it('異常系: 存在しないIDの場合はエラー', async () => {
      const entity = CompanyEntity.create({
        id: 'non-existent-id',
        name: 'テスト株式会社',
        phoneNumber: null,
        email: null,
        websiteUrl: null,
        recruitYearId: recruitYear.recruitYear,
        createdBy: 'system',
        updatedBy: 'system',
      });

      await expect(repository.update(entity)).rejects.toThrow();
    });
  });
});
