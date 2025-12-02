import { useCallback } from 'react';
import { formatDateToISOString } from '@/libs/date-utils';
import { downloadExcel } from '@/libs/excel-utils';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import toast from 'react-hot-toast';
import {
  interviewerCreateTemplateExcelHeaders,
  interviewerEditTemplateExcelHeaders,
} from '../constants/interviewer-csv.constants';
import type { InterviewerResponseDto } from '@/types/interviewer';

// 面接官一覧取得エラー用のカスタムエラークラス
class FetchInterviewersError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FetchInterviewersError';
  }
}

export const useInterviewerCsvTemplate = () => {
  const fetchAllInterviewers = useCallback(async (): Promise<
    InterviewerResponseDto[]
  > => {
    try {
      const data = await apiClient<{ interviewers: InterviewerResponseDto[] }>(
        '/interviewers',
      );
      return data.interviewers;
    } catch (err) {
      const message = extractErrorMessage(
        err,
        '面接官一覧の取得に失敗しました',
      );
      toast.error(message);
      throw new FetchInterviewersError(message);
    }
  }, []);

  const handleDownloadTemplateCSV = useCallback(async () => {
    const templateData = [
      {
        ID: 'user-id-1',
        カテゴリ: 'フロント',
      },
    ];

    const filename = `面接官登録テンプレート_${formatDateToISOString()}.xlsx`;
    await downloadExcel({
      data: templateData,
      headers: interviewerCreateTemplateExcelHeaders(),
      filename,
      sheetName: '面接官登録',
    });
  }, []);

  const handleDownloadEditTemplateCSV = useCallback(async () => {
    try {
      const allInterviewers = await fetchAllInterviewers();
      const templateData = allInterviewers.map((interviewer) => ({
        ID: interviewer.userId,
        カテゴリ: interviewer.category,
      }));

      const filename = `面接官編集テンプレート_${formatDateToISOString()}.xlsx`;
      await downloadExcel({
        data: templateData,
        headers: interviewerEditTemplateExcelHeaders(),
        filename,
        sheetName: '面接官編集',
      });
    } catch (err) {
      // fetchAllInterviewers以外のエラーの場合に備えて処理
      if (!(err instanceof FetchInterviewersError)) {
        const message = extractErrorMessage(
          err,
          'テンプレートのダウンロードに失敗しました',
        );
        toast.error(message);
      }
    }
  }, [fetchAllInterviewers]);

  return {
    handleDownloadTemplateCSV,
    handleDownloadEditTemplateCSV,
  };
};
