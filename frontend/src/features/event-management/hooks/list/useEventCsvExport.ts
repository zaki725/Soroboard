import { useCallback } from 'react';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import {
  formatDateToISOString,
  formatDateToJST,
  convertDateTimeLocalToISO,
} from '@/libs/date-utils';
import { convertToCSV, downloadCSV } from '@/libs/csv-utils';
import { eventExportCsvHeaders } from '../../constants/event-csv.constants';
import type { EventResponseDto } from '@/types/event';
import { useRecruitYear } from '@/contexts/RecruitYearContext';
import type { EventSearchFormData } from './useEventList';
import { useInterviewerOptions } from '../useInterviewerOptions';

type UseEventCsvExportParams = {
  searchParams: EventSearchFormData;
};

export const useEventCsvExport = ({
  searchParams,
}: UseEventCsvExportParams) => {
  const { selectedRecruitYear } = useRecruitYear();
  const { interviewerOptions } = useInterviewerOptions();

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
      if (searchParams.eventMasterId) {
        params.append('eventMasterId', searchParams.eventMasterId);
      }
      if (searchParams.locationId) {
        params.append('locationId', searchParams.locationId);
      }
      if (searchParams.interviewerId) {
        params.append('interviewerId', searchParams.interviewerId);
      }
      if (searchParams.startTimeFrom) {
        // datetime-local形式をISO形式に変換
        const isoFrom = convertDateTimeLocalToISO(searchParams.startTimeFrom);
        if (isoFrom) {
          params.append('startTimeFrom', isoFrom);
        }
      }

      const exportEvents = await apiClient<EventResponseDto[]>(
        `/events/export?${params.toString()}`,
      );

      // 面接官IDから面接官名へのマッピングを作成
      const interviewerMap = new Map(
        interviewerOptions.map((opt) => [opt.value, opt.label]),
      );

      const csvData = exportEvents.map((event) => {
        const interviewerNames = event.interviewerIds
          ? event.interviewerIds
              .map((id) => interviewerMap.get(id) || id)
              .filter(Boolean)
              .join(',')
          : '-';

        return {
          ID: event.id,
          イベントマスター名: event.eventMasterName,
          ロケーション名: event.locationName,
          開始時刻: event.startTime
            ? formatDateToJST(new Date(event.startTime))
            : '-',
          終了時刻: event.endTime
            ? formatDateToJST(new Date(event.endTime))
            : '-',
          備考: event.notes || '-',
          開催場所: event.address || '-',
          面接官名: interviewerNames,
        };
      });

      const csvContent = convertToCSV({
        data: csvData,
        headers: eventExportCsvHeaders,
      });
      const filename = `イベント一覧_${formatDateToISOString()}.csv`;
      downloadCSV({ csvContent, filename });
    } catch (err) {
      const message = extractErrorMessage(err, errorMessages.csvExportFailed);
      throw new Error(message);
    }
  }, [searchParams, selectedRecruitYear, interviewerOptions]);

  return {
    handleExportCSV,
  };
};
