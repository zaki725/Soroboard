import { useCompanyCsvExport } from './useCompanyCsvExport';
import { useCompanyCsvTemplate } from './useCompanyCsvTemplate';
import { useCompanyCsvUpload } from './useCompanyCsvUpload';
import type { CompanyResponseDto } from '@/types/company';

type CompanySearchFormData = {
  id: string;
  search: string;
};

type UseCompanyCsvParams = {
  searchParams: CompanySearchFormData;
  fetchCompanies: () => Promise<void>;
  selectedRecruitYearId: number;
};

export const useCompanyCsv = ({
  searchParams,
  fetchCompanies,
  selectedRecruitYearId,
}: UseCompanyCsvParams) => {
  const csvExport = useCompanyCsvExport({
    searchParams,
    selectedRecruitYearId,
  });
  const csvTemplate = useCompanyCsvTemplate({
    selectedRecruitYearId,
  });
  const csvUpload = useCompanyCsvUpload({
    fetchCompanies,
    selectedRecruitYearId,
  });

  return {
    ...csvExport,
    ...csvTemplate,
    ...csvUpload,
  };
};
