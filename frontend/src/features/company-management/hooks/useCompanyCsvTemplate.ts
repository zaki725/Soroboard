import { useCallback } from 'react';
import { formatDateToISOString } from '@/libs/date-utils';
import { downloadExcel, type ExcelHeader } from '@/libs/excel-utils';
import {
  companyCreateTemplateCsvHeaders,
  companyEditTemplateCsvHeaders,
} from '../constants/company-csv.constants';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import toast from 'react-hot-toast';
import type { CompanyResponseDto } from '@/types/company';

type UseCompanyCsvTemplateParams = {
  selectedRecruitYearId: number;
};

export const useCompanyCsvTemplate = ({
  selectedRecruitYearId,
}: UseCompanyCsvTemplateParams) => {
  const fetchAllCompanies = useCallback(async (): Promise<
    CompanyResponseDto[]
  > => {
    try {
      const params = new URLSearchParams();
      params.append('recruitYearId', String(selectedRecruitYearId));
      const allCompanies = await apiClient<CompanyResponseDto[]>(
        `/companies?${params.toString()}`,
      );
      return allCompanies;
    } catch (err) {
      const message = extractErrorMessage(err, '会社一覧の取得に失敗しました');
      toast.error(message);
      throw new Error(message);
    }
  }, [selectedRecruitYearId]);

  const handleDownloadTemplateCSV = useCallback(async () => {
    const templateData = [
      {
        会社名: 'レバレジーズ株式会社',
        電話番号: '03-1234-5678',
        メールアドレス: 'info@example.com',
        WEBサイトURL: 'https://example.com',
      },
    ];

    // Excelファイルとしてダウンロード（会社管理はプルダウンなし）
    const excelHeaders: ExcelHeader[] = companyCreateTemplateCsvHeaders.map(
      (header) => ({
        key: header.key,
        label: header.label,
      }),
    );
    const filename = `会社登録テンプレート_${formatDateToISOString()}.xlsx`;
    await downloadExcel({
      data: templateData,
      headers: excelHeaders,
      filename,
      sheetName: '会社登録',
    });
  }, []);

  const handleDownloadEditTemplateCSV = useCallback(async () => {
    try {
      const allCompanies = await fetchAllCompanies();
      const templateData = allCompanies.map((company) => ({
        ID: company.id,
        会社名: company.name,
        電話番号: company.phoneNumber || '',
        メールアドレス: company.email || '',
        WEBサイトURL: company.websiteUrl || '',
      }));

      // Excelファイルとしてダウンロード（会社管理はプルダウンなし）
      const excelHeaders: ExcelHeader[] = companyEditTemplateCsvHeaders.map(
        (header) => ({
          key: header.key,
          label: header.label,
        }),
      );
      const filename = `会社編集テンプレート_${formatDateToISOString()}.xlsx`;
      await downloadExcel({
        data: templateData,
        headers: excelHeaders,
        filename,
        sheetName: '会社編集',
      });
    } catch {
      // エラーはfetchAllCompanies内で処理済み
    }
  }, [fetchAllCompanies]);

  return {
    handleDownloadTemplateCSV,
    handleDownloadEditTemplateCSV,
  };
};
