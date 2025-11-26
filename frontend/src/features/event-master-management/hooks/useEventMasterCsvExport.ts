import { useCallback } from 'react';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import { formatDateToISOString } from '@/libs/date-utils';
import { convertToCSV, downloadCSV } from '@/libs/csv-utils';
import { eventMasterExportCsvHeaders } from '../constants/event-master-csv.constants';
import type { EventMasterResponseDto } from '@/types/event-master';
import { useRecruitYear } from '@/contexts/RecruitYearContext';

type EventMasterSearchFormData = {
  id: string;
  search: string;
  type: string;
};

type UseEventMasterCsvExportParams = {
  searchParams: EventMasterSearchFormData;
};

export const useEventMasterCsvExport = ({
  searchParams,
}: UseEventMasterCsvExportParams) => {
  const { selectedRecruitYear } = useRecruitYear();

  const handleExportCSV = useCallback(async () => {
    if (!selectedRecruitYear) {
      throw new Error('年度が選択されていません');
    }

    try {
      const params = new URLSearchParams();
      params.set('recruitYearId', String(selectedRecruitYear.recruitYear));
      if (searchParams.id) {
        params.append('id', searchParams.id);
      }
      if (searchParams.search) {
        params.append('search', searchParams.search);
      }
      if (searchParams.type) {
        params.append('type', searchParams.type);
      }

      const exportEventMasters = await apiClient<EventMasterResponseDto[]>(
        `/event-masters?${params.toString()}`,
      );

      const csvData = exportEventMasters.map((eventMaster) => ({
        ID: eventMaster.id,
        イベント名: eventMaster.name,
        説明: eventMaster.description || '',
        タイプ: eventMaster.type,
      }));

      const csvContent = convertToCSV({
        data: csvData,
        headers: eventMasterExportCsvHeaders,
      });
      const filename = `イベントマスター一覧_${formatDateToISOString()}.csv`;
      downloadCSV({ csvContent, filename });
    } catch (err) {
      const message = extractErrorMessage(err, errorMessages.csvExportFailed);
      throw new Error(message);
    }
  }, [searchParams, selectedRecruitYear]);

  return {
    handleExportCSV,
  };
};
