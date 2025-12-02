import { useCallback } from 'react';
import { formatDateToISOString } from '@/libs/date-utils';
import { downloadExcel } from '@/libs/excel-utils';
import {
  eventMasterCreateTemplateExcelHeaders,
  eventMasterEditTemplateExcelHeaders,
} from '../constants/event-master-excel.constants';
import { apiClient } from '@/libs/api-client';
import type { EventMasterResponseDto } from '@/types/event-master';
import { extractErrorMessage } from '@/libs/error-handler';
import toast from 'react-hot-toast';
import { useRecruitYear } from '@/contexts/RecruitYearContext';

class FetchEventMastersError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FetchEventMastersError';
  }
}

export const useEventMasterCsvTemplate = () => {
  const { selectedRecruitYear } = useRecruitYear();

  const fetchAllEventMasters = useCallback(async (): Promise<
    EventMasterResponseDto[]
  > => {
    if (!selectedRecruitYear) {
      throw new FetchEventMastersError('年度が選択されていません');
    }

    try {
      const allEventMasters = await apiClient<EventMasterResponseDto[]>(
        `/event-masters?recruitYearId=${selectedRecruitYear.recruitYear}`,
      );
      return allEventMasters;
    } catch (err) {
      const message = extractErrorMessage(
        err,
        'イベントマスター一覧の取得に失敗しました',
      );
      toast.error(message);
      throw new FetchEventMastersError(message);
    }
  }, [selectedRecruitYear]);

  const handleDownloadTemplateCSV = useCallback(async () => {
    const templateData = [
      {
        イベント名: '説明会',
        説明: '新卒向け説明会',
        タイプ: 'オンライン',
      },
    ];

    const filename = `イベントマスター登録テンプレート_${formatDateToISOString()}.xlsx`;
    await downloadExcel({
      data: templateData,
      headers: eventMasterCreateTemplateExcelHeaders(),
      filename,
      sheetName: 'イベントマスター登録',
    });
  }, []);

  const handleDownloadEditTemplateCSV = useCallback(async () => {
    try {
      const allEventMasters = await fetchAllEventMasters();
      const templateData = allEventMasters.map((eventMaster) => ({
        ID: eventMaster.id,
        イベント名: eventMaster.name,
        説明: eventMaster.description || '',
        タイプ: eventMaster.type,
      }));

      const filename = `イベントマスター編集テンプレート_${formatDateToISOString()}.xlsx`;
      await downloadExcel({
        data: templateData,
        headers: eventMasterEditTemplateExcelHeaders(),
        filename,
        sheetName: 'イベントマスター編集',
      });
    } catch (err) {
      if (err instanceof FetchEventMastersError) {
        // fetchAllEventMastersのエラーは既にtoastで表示済み
        return;
      }
      const message = extractErrorMessage(
        err,
        'テンプレートのダウンロードに失敗しました',
      );
      toast.error(message);
    }
  }, [fetchAllEventMasters]);

  return {
    handleDownloadTemplateCSV,
    handleDownloadEditTemplateCSV,
  };
};
