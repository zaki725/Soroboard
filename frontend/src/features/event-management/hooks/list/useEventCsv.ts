import { useEventCsvExport } from './useEventCsvExport';
import { useEventCsvTemplate } from './useEventCsvTemplate';
import { useEventCsvUpload } from './useEventCsvUpload';
import type { EventSearchFormData } from './useEventList';

type UseEventCsvParams = {
  searchParams: EventSearchFormData;
  fetchEvents: () => Promise<void>;
};

export const useEventCsv = ({
  searchParams,
  fetchEvents,
}: UseEventCsvParams) => {
  const csvExport = useEventCsvExport({ searchParams });
  const csvTemplate = useEventCsvTemplate();
  const csvUpload = useEventCsvUpload({ fetchEvents });

  return {
    ...csvExport,
    ...csvTemplate,
    ...csvUpload,
  };
};
