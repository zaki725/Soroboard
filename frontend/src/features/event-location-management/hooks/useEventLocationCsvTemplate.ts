import { useCallback } from 'react';
import { formatDateToISOString } from '@/libs/date-utils';
import { downloadExcel } from '@/libs/excel-utils';
import {
  eventLocationCreateTemplateExcelHeaders,
  eventLocationEditTemplateExcelHeaders,
} from '../constants/event-location-excel.constants';
import { apiClient } from '@/libs/api-client';
import type { EventLocationResponseDto } from '@/types/event-location';
import { extractErrorMessage } from '@/libs/error-handler';
import toast from 'react-hot-toast';

class FetchEventLocationsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FetchEventLocationsError';
  }
}

export const useEventLocationCsvTemplate = () => {
  const fetchAllEventLocations = useCallback(async (): Promise<
    EventLocationResponseDto[]
  > => {
    try {
      const allEventLocations =
        await apiClient<EventLocationResponseDto[]>('/event-locations');
      return allEventLocations;
    } catch (err) {
      const message = extractErrorMessage(
        err,
        'ロケーション一覧の取得に失敗しました',
      );
      toast.error(message);
      throw new FetchEventLocationsError(message);
    }
  }, []);

  const handleDownloadTemplateCSV = useCallback(async () => {
    const templateData = [
      {
        ロケーション名: '東京オフィス',
      },
    ];

    const filename = `ロケーション登録テンプレート_${formatDateToISOString()}.xlsx`;
    await downloadExcel({
      data: templateData,
      headers: eventLocationCreateTemplateExcelHeaders(),
      filename,
      sheetName: 'ロケーション登録',
    });
  }, []);

  const handleDownloadEditTemplateCSV = useCallback(async () => {
    try {
      const allEventLocations = await fetchAllEventLocations();
      const templateData = allEventLocations.map((eventLocation) => ({
        ID: eventLocation.id,
        ロケーション名: eventLocation.name,
      }));

      const filename = `ロケーション編集テンプレート_${formatDateToISOString()}.xlsx`;
      await downloadExcel({
        data: templateData,
        headers: eventLocationEditTemplateExcelHeaders(),
        filename,
        sheetName: 'ロケーション編集',
      });
    } catch (err) {
      if (err instanceof FetchEventLocationsError) {
        // fetchAllEventLocationsのエラーは既にtoastで表示済み
        return;
      }
      const message = extractErrorMessage(
        err,
        'テンプレートのダウンロードに失敗しました',
      );
      toast.error(message);
    }
  }, [fetchAllEventLocations]);

  return {
    handleDownloadTemplateCSV,
    handleDownloadEditTemplateCSV,
  };
};
