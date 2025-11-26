import { useCallback } from 'react';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import { formatDateToISOString } from '@/libs/date-utils';
import { convertToCSV, downloadCSV } from '@/libs/csv-utils';
import { eventLocationExportCsvHeaders } from '../constants/event-location-csv.constants';
import type { EventLocationResponseDto } from '@/types/event-location';
type EventLocationSearchFormData = {
  id: string;
  search: string;
};

type UseEventLocationCsvExportParams = {
  searchParams: EventLocationSearchFormData;
};

export const useEventLocationCsvExport = ({
  searchParams,
}: UseEventLocationCsvExportParams) => {
  const handleExportCSV = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchParams.id) {
        params.append('id', searchParams.id);
      }
      if (searchParams.search) {
        params.append('search', searchParams.search);
      }

      const exportEventLocations = await apiClient<EventLocationResponseDto[]>(
        `/event-locations?${params.toString()}`,
      );

      const csvData = exportEventLocations.map((eventLocation) => ({
        ID: eventLocation.id,
        ロケーション名: eventLocation.name,
      }));

      const csvContent = convertToCSV({
        data: csvData,
        headers: eventLocationExportCsvHeaders,
      });
      const filename = `ロケーション一覧_${formatDateToISOString()}.csv`;
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
