import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { CompanyDao } from '../../dao/company/company.dao';
import { Company } from '@prisma/client';

describe('CompanyService', () => {
  let service: CompanyService;
  let dao: CompanyDao;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: CompanyDao,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    dao = module.get<CompanyDao>(CompanyDao);
  });

  describe('findAll', () => {
    it('正常系: 会社一覧を取得できる', async () => {
      const mockCompanies: Company[] = [
        {
          id: '1',
          name: 'テスト株式会社',
          phoneNumber: '03-1234-5678',
          email: 'test@example.com',
          websiteUrl: 'https://example.com',
          recruitYearId: 2024,
          createdAt: new Date(),
          createdBy: 'system',
          updatedAt: new Date(),
          updatedBy: 'system',
        },
      ];

      const findAllSpy = jest
        .spyOn(dao, 'findAll')
        .mockResolvedValue(mockCompanies);

      const result = await service.findAll({
        recruitYearId: 2024,
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: mockCompanies[0].id,
        name: mockCompanies[0].name,
        phoneNumber: mockCompanies[0].phoneNumber,
        email: mockCompanies[0].email,
        websiteUrl: mockCompanies[0].websiteUrl,
        recruitYearId: mockCompanies[0].recruitYearId,
      });
      expect(findAllSpy).toHaveBeenCalledWith({
        recruitYearId: 2024,
        ids: undefined,
        search: undefined,
      });
    });

    it('正常系: ID文字列を配列に変換して検索できる', async () => {
      const mockCompanies: Company[] = [
        {
          id: '1',
          name: 'テスト株式会社',
          phoneNumber: null,
          email: null,
          websiteUrl: null,
          recruitYearId: 2024,
          createdAt: new Date(),
          createdBy: 'system',
          updatedAt: new Date(),
          updatedBy: 'system',
        },
      ];

      const findAllSpy = jest
        .spyOn(dao, 'findAll')
        .mockResolvedValue(mockCompanies);

      const result = await service.findAll({
        recruitYearId: 2024,
        id: '1, 2, 3',
      });

      expect(findAllSpy).toHaveBeenCalledWith({
        recruitYearId: 2024,
        ids: ['1', '2', '3'],
        search: undefined,
      });
      expect(result).toHaveLength(1);
    });

    it('正常系: 検索キーワードで検索できる', async () => {
      const mockCompanies: Company[] = [];

      const findAllSpy = jest
        .spyOn(dao, 'findAll')
        .mockResolvedValue(mockCompanies);

      await service.findAll({
        recruitYearId: 2024,
        search: 'テスト',
      });

      expect(findAllSpy).toHaveBeenCalledWith({
        recruitYearId: 2024,
        ids: undefined,
        search: 'テスト',
      });
    });

    it('正常系: すべてのパラメータを組み合わせて検索できる', async () => {
      const mockCompanies: Company[] = [];

      const findAllSpy = jest
        .spyOn(dao, 'findAll')
        .mockResolvedValue(mockCompanies);

      await service.findAll({
        recruitYearId: 2024,
        id: '1, 2',
        search: 'テスト',
      });

      expect(findAllSpy).toHaveBeenCalledWith({
        recruitYearId: 2024,
        ids: ['1', '2'],
        search: 'テスト',
      });
    });
  });
});
