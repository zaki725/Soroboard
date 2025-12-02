import { useCallback } from 'react';
import { formatDateToISOString } from '@/libs/date-utils';
import { downloadExcel, ExcelHeader } from '@/libs/excel-utils';
import { apiClient } from '@/libs/api-client';
import type { FacultyResponseDto } from '@/types/faculty';
import { extractErrorMessage } from '@/libs/error-handler';
import toast from 'react-hot-toast';

type UseFacultyCsvTemplateParams = {
  universityId: string;
};

const facultyCreateTemplateExcelHeaders: ExcelHeader[] = [
  { key: '学部名', label: '学部名' },
  { key: '偏差値', label: '偏差値' },
];

const facultyEditTemplateExcelHeaders: ExcelHeader[] = [
  { key: 'ID', label: 'ID' },
  { key: '学部名', label: '学部名' },
  { key: '偏差値', label: '偏差値' },
];

export const useFacultyCsvTemplate = ({
  universityId,
}: UseFacultyCsvTemplateParams) => {
  const fetchAllFaculties = useCallback(async (): Promise<
    FacultyResponseDto[]
  > => {
    try {
      const allFaculties = await apiClient<FacultyResponseDto[]>(
        `/universities/${universityId}/faculties`,
      );
      return allFaculties;
    } catch (err) {
      const message = extractErrorMessage(err, '学部一覧の取得に失敗しました');
      toast.error(message);
      throw new Error(message);
    }
  }, [universityId]);

  const handleDownloadTemplateCSV = useCallback(async () => {
    const templateData = [
      {
        学部名: '工学部',
        偏差値: '72.5',
      },
      {
        学部名: '理学部',
        偏差値: '70.0',
      },
    ];

    const filename = `学部登録テンプレート_${formatDateToISOString()}.xlsx`;
    await downloadExcel({
      data: templateData,
      headers: facultyCreateTemplateExcelHeaders,
      filename,
      sheetName: '学部登録',
    });
  }, []);

  const handleDownloadEditTemplateCSV = useCallback(async () => {
    try {
      const allFaculties = await fetchAllFaculties();
      const templateData = allFaculties.map((faculty) => ({
        ID: faculty.id,
        学部名: faculty.name,
        偏差値: faculty.deviationValue?.value || '',
      }));

      const filename = `学部編集テンプレート_${formatDateToISOString()}.xlsx`;
      await downloadExcel({
        data: templateData,
        headers: facultyEditTemplateExcelHeaders,
        filename,
        sheetName: '学部編集',
      });
    } catch {
      // エラーはfetchAllFaculties内で処理済み
    }
  }, [fetchAllFaculties]);

  return {
    handleDownloadTemplateCSV,
    handleDownloadEditTemplateCSV,
  };
};
