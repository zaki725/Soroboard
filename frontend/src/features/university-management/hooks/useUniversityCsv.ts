import { useUniversityCsvExport } from './useUniversityCsvExport';
import { useUniversityCsvTemplate } from './useUniversityCsvTemplate';
import { useUniversityCsvUpload } from './useUniversityCsvUpload';
import type {
  UniversityResponseDto,
  UniversityRankLevel,
} from '@/types/university';

type UniversitySearchFormData = {
  id: string;
  search: string;
  rank: UniversityRankLevel | '';
};

type UseUniversityCsvParams = {
  searchParams: UniversitySearchFormData;
  fetchUniversities: () => Promise<void>;
};

export const useUniversityCsv = ({
  searchParams,
  fetchUniversities,
}: UseUniversityCsvParams) => {
  const csvExport = useUniversityCsvExport({ searchParams });
  const csvTemplate = useUniversityCsvTemplate();
  const csvUpload = useUniversityCsvUpload({ fetchUniversities });

  return {
    ...csvExport,
    ...csvTemplate,
    ...csvUpload,
  };
};
