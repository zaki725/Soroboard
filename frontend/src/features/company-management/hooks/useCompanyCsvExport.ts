import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import { formatDateToISOString } from '@/libs/date-utils';
import { convertToCSV, downloadCSV } from '@/libs/csv-utils';
import { companyExportCsvHeaders } from '../constants/company-csv.constants';
import type { CompanyResponseDto } from '@/types/company';

type CompanySearchFormData = {
  id: string;
  search: string;
};

type UseCompanyCsvExportParams = {
  searchParams: CompanySearchFormData;
  selectedRecruitYearId: number;
};

export const useCompanyCsvExport = ({
  searchParams,
  selectedRecruitYearId,
}: UseCompanyCsvExportParams) => {
  const handleExportCSV = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append('recruitYearId', String(selectedRecruitYearId));
      if (searchParams.id) {
        params.append('id', searchParams.id);
      }
      if (searchParams.search) {
        params.append('search', searchParams.search);
      }

      const exportCompanies = await apiClient<CompanyResponseDto[]>(
        `/companies?${params.toString()}`,
      );

      const csvData = exportCompanies.map((company) => ({
        ID: company.id,
        会社名: company.name,
        電話番号: company.phoneNumber || '-',
        メールアドレス: company.email || '-',
        WEBサイトURL: company.websiteUrl || '-',
      }));

      const csvContent = convertToCSV({
        data: csvData,
        headers: companyExportCsvHeaders,
      });
      const filename = `会社一覧_${formatDateToISOString()}.csv`;
      downloadCSV({ csvContent, filename });
      toast.success('CSVを出力しました');
    } catch (err) {
      const message = extractErrorMessage(err, errorMessages.csvExportFailed);
      throw new Error(message);
    }
  }, [searchParams, selectedRecruitYearId]);

  return {
    handleExportCSV,
  };
};
