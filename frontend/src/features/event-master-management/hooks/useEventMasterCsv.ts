import { useEventMasterCsvExport } from './useEventMasterCsvExport';
import { useEventMasterCsvTemplate } from './useEventMasterCsvTemplate';
import { useEventMasterCsvUpload } from './useEventMasterCsvUpload';

type EventMasterSearchFormData = {
  id: string;
  search: string;
  type: string;
};

type UseEventMasterCsvParams = {
  searchParams: EventMasterSearchFormData;
  refetch: () => Promise<void>;
};

export const useEventMasterCsv = ({
  searchParams,
  refetch,
}: UseEventMasterCsvParams) => {
  const csvExport = useEventMasterCsvExport({ searchParams });
  const csvTemplate = useEventMasterCsvTemplate();
  const csvUpload = useEventMasterCsvUpload({ refetch });

  return {
    ...csvExport,
    ...csvTemplate,
    ...csvUpload,
  };
};
