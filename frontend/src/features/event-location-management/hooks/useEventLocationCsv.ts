import { useEventLocationCsvExport } from './useEventLocationCsvExport';
import { useEventLocationCsvTemplate } from './useEventLocationCsvTemplate';
import { useEventLocationCsvUpload } from './useEventLocationCsvUpload';

type EventLocationSearchFormData = {
  id: string;
  search: string;
};

type UseEventLocationCsvParams = {
  searchParams: EventLocationSearchFormData;
  fetchEventLocations: () => Promise<void>;
};

export const useEventLocationCsv = ({
  searchParams,
  fetchEventLocations,
}: UseEventLocationCsvParams) => {
  const csvExport = useEventLocationCsvExport({ searchParams });
  const csvTemplate = useEventLocationCsvTemplate();
  const csvUpload = useEventLocationCsvUpload({ fetchEventLocations });

  return {
    ...csvExport,
    ...csvTemplate,
    ...csvUpload,
  };
};
