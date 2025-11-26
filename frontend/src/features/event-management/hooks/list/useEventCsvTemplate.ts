import { useCallback } from 'react';
import { formatDateToISOString } from '@/libs/date-utils';
import { downloadExcel } from '@/libs/excel-utils';
import {
  eventCreateTemplateExcelHeaders,
  eventEditTemplateExcelHeaders,
} from '../../constants/event-excel.constants';
import { apiClient } from '@/libs/api-client';
import type { EventResponseDto } from '@/types/event';
import { extractErrorMessage } from '@/libs/error-handler';
import toast from 'react-hot-toast';
import { useEventMasterOptions } from '../useEventMasterOptions';
import { useEventLocationOptions } from '../useEventLocationOptions';
import { useRecruitYear } from '@/contexts/RecruitYearContext';

export const useEventCsvTemplate = () => {
  const { selectedRecruitYear } = useRecruitYear();
  const { eventMasterOptions } = useEventMasterOptions();
  const { eventLocationOptions } = useEventLocationOptions();

  const eventMasterIds = eventMasterOptions.map((opt) => opt.value);
  const eventLocationIds = eventLocationOptions.map((opt) => opt.value);

  const fetchAllEvents = useCallback(async (): Promise<EventResponseDto[]> => {
    if (!selectedRecruitYear) {
      throw new Error('年度が選択されていません');
    }

    try {
      const allEvents = await apiClient<EventResponseDto[]>(
        `/events/export?recruitYearId=${selectedRecruitYear.recruitYear}`,
      );
      return allEvents;
    } catch (err) {
      const message = extractErrorMessage(
        err,
        'イベント一覧の取得に失敗しました',
      );
      toast.error(message);
      throw new Error(message);
    }
  }, [selectedRecruitYear]);

  const handleDownloadTemplateCSV = useCallback(async () => {
    const templateData = [
      {
        イベントマスターID: '',
        ロケーションID: '',
        開始時刻: '',
        終了時刻: '',
        備考: '',
        開催場所: '',
        '面接官ID（カンマ区切り）': '',
      },
    ];

    const filename = `イベント登録テンプレート_${formatDateToISOString()}.xlsx`;
    await downloadExcel({
      data: templateData,
      headers: eventCreateTemplateExcelHeaders(
        eventMasterIds,
        eventLocationIds,
      ),
      filename,
      sheetName: 'イベント登録',
    });
  }, [eventMasterIds, eventLocationIds]);

  const handleDownloadEditTemplateCSV = useCallback(async () => {
    try {
      const allEvents = await fetchAllEvents();
      const templateData = allEvents.map((event) => ({
        ID: event.id,
        イベントマスターID: event.eventMasterId,
        ロケーションID: event.locationId,
        開始時刻: event.startTime
          ? new Date(event.startTime).toISOString().slice(0, 16)
          : '',
        終了時刻: event.endTime
          ? new Date(event.endTime).toISOString().slice(0, 16)
          : '',
        備考: event.notes || '',
        開催場所: event.address || '',
        '面接官ID（カンマ区切り）': event.interviewerIds?.join(',') || '',
      }));

      const filename = `イベント編集テンプレート_${formatDateToISOString()}.xlsx`;
      await downloadExcel({
        data: templateData,
        headers: eventEditTemplateExcelHeaders(
          eventMasterIds,
          eventLocationIds,
        ),
        filename,
        sheetName: 'イベント編集',
      });
    } catch (err) {
      if (
        err instanceof Error &&
        !err.message.includes('イベント一覧の取得に失敗')
      ) {
        const message = extractErrorMessage(
          err,
          'テンプレートのダウンロードに失敗しました',
        );
        toast.error(message);
      }
    }
  }, [fetchAllEvents, eventMasterIds, eventLocationIds]);

  return {
    handleDownloadTemplateCSV,
    handleDownloadEditTemplateCSV,
  };
};
