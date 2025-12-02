import { useCallback } from 'react';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import { formatDateToISOString } from '@/libs/date-utils';
import { convertToCSV, downloadCSV } from '@/libs/csv-utils';
import { universityExportCsvHeaders } from '../constants/university-csv.constants';
import type {
  UniversityResponseDto,
  UniversityRankLevel,
} from '@/types/university';

type UniversitySearchFormData = {
  id: string;
  search: string;
  rank: UniversityRankLevel | '';
};

type UseUniversityCsvExportParams = {
  searchParams: UniversitySearchFormData;
};

export const useUniversityCsvExport = ({
  searchParams,
}: UseUniversityCsvExportParams) => {
  const handleExportCSV = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchParams.id) {
        params.append('id', searchParams.id);
      }
      if (searchParams.search) {
        params.append('search', searchParams.search);
      }
      if (searchParams.rank) {
        params.append('rank', searchParams.rank);
      }

      const exportUniversities = await apiClient<UniversityResponseDto[]>(
        `/universities?${params.toString()}`,
      );

      const csvData = exportUniversities.map((university) => ({
        ID: university.id,
        大学名: university.name,
        学校ランク: university.rank || '-',
      }));

      const csvContent = convertToCSV({
        data: csvData,
        headers: universityExportCsvHeaders,
      });
      const filename = `大学一覧_${formatDateToISOString()}.csv`;
      downloadCSV({ csvContent, filename });
    } catch (err) {
      const message = extractErrorMessage(err, errorMessages.csvExportFailed);
      throw new Error(message);
    }
  }, [searchParams]);

  return {
    handleExportCSV,
  };
};
