import { useCallback } from 'react';
import { formatDateToISOString } from '@/libs/date-utils';
import { downloadExcel, ExcelHeader } from '@/libs/excel-utils';
import { apiClient } from '@/libs/api-client';
import type { UniversityResponseDto } from '@/types/university';
import { extractErrorMessage } from '@/libs/error-handler';
import toast from 'react-hot-toast';

const universityCreateTemplateExcelHeaders: ExcelHeader[] = [
  { key: '大学名', label: '大学名' },
  {
    key: '学校ランク',
    label: '学校ランク',
    validation: {
      type: 'list',
      values: ['', 'S', 'A', 'B', 'C', 'D'],
    },
  },
];

const universityEditTemplateExcelHeaders: ExcelHeader[] = [
  { key: 'ID', label: 'ID' },
  { key: '大学名', label: '大学名' },
  {
    key: '学校ランク',
    label: '学校ランク',
    validation: {
      type: 'list',
      values: ['', 'S', 'A', 'B', 'C', 'D'],
    },
  },
];

export const useUniversityCsvTemplate = () => {
  const fetchAllUniversities = useCallback(async (): Promise<
    UniversityResponseDto[]
  > => {
    try {
      const allUniversities =
        await apiClient<UniversityResponseDto[]>('/universities');
      return allUniversities;
    } catch (err) {
      const message = extractErrorMessage(err, '大学一覧の取得に失敗しました');
      toast.error(message);
      throw new Error(message);
    }
  }, []);

  const handleDownloadTemplateCSV = useCallback(async () => {
    const templateData = [
      {
        大学名: '東京大学',
        学校ランク: 'S',
      },
      {
        大学名: '京都大学',
        学校ランク: 'A',
      },
    ];

    const filename = `大学登録テンプレート_${formatDateToISOString()}.xlsx`;
    await downloadExcel({
      data: templateData,
      headers: universityCreateTemplateExcelHeaders,
      filename,
      sheetName: '大学登録',
    });
  }, []);

  const handleDownloadEditTemplateCSV = useCallback(async () => {
    try {
      const allUniversities = await fetchAllUniversities();
      const templateData = allUniversities.map((university) => ({
        ID: university.id,
        大学名: university.name,
        学校ランク: university.rank || '',
      }));

      const filename = `大学編集テンプレート_${formatDateToISOString()}.xlsx`;
      await downloadExcel({
        data: templateData,
        headers: universityEditTemplateExcelHeaders,
        filename,
        sheetName: '大学編集',
      });
    } catch {
      // エラーはfetchAllUniversities内で処理済み
    }
  }, [fetchAllUniversities]);

  return {
    handleDownloadTemplateCSV,
    handleDownloadEditTemplateCSV,
  };
};
