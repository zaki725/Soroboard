import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import { parseCSV } from '@/libs/csv-parse';
import type { FacultyResponseDto } from '@/types/faculty';

type UseFacultyCsvUploadParams = {
  universityId: string;
  fetchFaculties: () => Promise<void>;
};

export const useFacultyCsvUpload = ({
  universityId,
  fetchFaculties,
}: UseFacultyCsvUploadParams) => {
  const validateFileType = (file: File): void => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'csv') {
      throw new Error(
        `CSVファイルを選択してください。選択されたファイル: ${file.name}（${
          file.type || '不明な形式'
        }）`,
      );
    }

    if (
      file.type &&
      !file.type.includes('csv') &&
      !file.type.includes('text')
    ) {
      if (
        file.type.includes('spreadsheet') ||
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls')
      ) {
        throw new Error(
          'Excelファイルが選択されました。CSVファイルを選択してください。Excelファイルを使用する場合は、「Excelテンプレート」ボタンからダウンロードしたファイルをCSV形式で保存してからアップロードしてください。',
        );
      }
      throw new Error(
        `対応していないファイル形式です。CSVファイルを選択してください。選択されたファイル: ${file.name}（${file.type}）`,
      );
    }
  };

  const validateCsvData = (
    csvData: Record<string, string>[],
    isEdit: boolean,
  ): Record<string, string>[] => {
    const validCsvData = csvData.filter((row) => {
      const hasAnyValue = Object.values(row).some(
        (value) => String(value || '').trim() !== '',
      );
      return hasAnyValue;
    });

    if (validCsvData.length === 0) {
      throw new Error('CSVファイルにデータが含まれていません');
    }

    if (!isEdit) {
      const invalidRows = validCsvData.filter((row) => {
        const name = String(row['学部名'] || '').trim();
        return !name;
      });

      if (invalidRows.length > 0) {
        const firstInvalidRow = invalidRows[0];
        const rowIndex = validCsvData.indexOf(firstInvalidRow);
        const allKeys = Object.keys(firstInvalidRow);

        throw new Error(
          `必須項目が不足している行があります: ${invalidRows.length}件。例: 行${
            rowIndex + 1
          }の列名=[${allKeys.join(', ')}]（学部名は必須です）`,
        );
      }
    }

    if (isEdit) {
      const invalidRows = validCsvData.filter((row) => !row['ID']);
      if (invalidRows.length > 0) {
        throw new Error(
          `IDが不足している行があります: ${invalidRows.length}件`,
        );
      }
    }

    return validCsvData;
  };

  const convertCsvRowToFaculty = useCallback(
    (
      row: Record<string, string>,
      isEdit: boolean,
    ): {
      id?: string;
      name: string;
      deviationValue?: number;
    } => {
      const deviationValueStr = String(row['偏差値'] || '').trim();
      const deviationValue = deviationValueStr
        ? parseFloat(deviationValueStr)
        : undefined;

      return {
        ...(isEdit && { id: row['ID'] }),
        name: row['学部名'],
        deviationValue:
          deviationValue !== undefined && !isNaN(deviationValue)
            ? deviationValue
            : undefined,
      };
    },
    [],
  );

  const handleBulkEdit = useCallback(
    async (
      faculties: Array<{
        id: string;
        name: string;
        deviationValue?: number;
      }>,
    ) => {
      let succeeded = 0;
      let failed = 0;

      const results = await Promise.allSettled(
        faculties.map((faculty) =>
          apiClient<FacultyResponseDto>(`/faculties`, {
            method: 'PUT',
            body: {
              id: faculty.id,
              name: faculty.name,
            },
          }).then(async () => {
            if (faculty.deviationValue !== undefined) {
              // 偏差値の更新は別途処理（既存のAPIを使用）
              const existingFaculties = await apiClient<FacultyResponseDto[]>(
                `/universities/${universityId}/faculties`,
              );
              const existingFaculty = existingFaculties.find(
                (f) => f.id === faculty.id,
              );
              if (existingFaculty?.deviationValue) {
                await apiClient(`/deviation-values`, {
                  method: 'PUT',
                  body: {
                    id: existingFaculty.deviationValue.id,
                    value: faculty.deviationValue,
                  },
                });
              } else if (existingFaculty) {
                await apiClient(`/deviation-values`, {
                  method: 'POST',
                  body: {
                    facultyId: existingFaculty.id,
                    value: faculty.deviationValue,
                  },
                });
              }
            }
          }),
        ),
      );

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          succeeded++;
        } else {
          failed++;
        }
      });

      await fetchFaculties();
      if (failed > 0) {
        toast.error(`${succeeded}件成功、${failed}件失敗しました`);
      } else {
        toast.success(`学部を${succeeded}件更新しました`);
      }
    },
    [universityId, fetchFaculties],
  );

  const handleBulkCreate = useCallback(
    async (
      faculties: Array<{
        name: string;
        deviationValue?: number;
      }>,
    ) => {
      try {
        await apiClient<FacultyResponseDto[]>(
          `/faculties/universities/${universityId}/bulk`,
          {
            method: 'POST',
            body: {
              faculties,
            },
          },
        );

        await fetchFaculties();
        toast.success(`学部を${faculties.length}件登録しました`);
      } catch (error) {
        const message = extractErrorMessage(
          error,
          errorMessages.csvUploadFailed,
        );
        throw new Error(message);
      }
    },
    [universityId, fetchFaculties],
  );

  const handleUploadCSV = useCallback(
    async (file: File, isEdit: boolean) => {
      try {
        validateFileType(file);

        const csvData = await parseCSV(file);
        const validCsvData = validateCsvData(csvData, isEdit);

        const faculties = validCsvData.map((row) =>
          convertCsvRowToFaculty(row, isEdit),
        );

        if (isEdit) {
          await handleBulkEdit(
            faculties as Parameters<typeof handleBulkEdit>[0],
          );
        } else {
          await handleBulkCreate(
            faculties as Parameters<typeof handleBulkCreate>[0],
          );
        }
      } catch (err) {
        const message = extractErrorMessage(err, errorMessages.csvUploadFailed);
        throw new Error(message);
      }
    },
    [handleBulkEdit, handleBulkCreate, convertCsvRowToFaculty],
  );

  return {
    handleUploadCSV,
  };
};
