import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import { parseCSV } from '@/libs/csv-parse';
import { chunk } from '@/libs/array-utils';
import type {
  UniversityResponseDto,
  UniversityRankLevel,
} from '@/types/university';

type UseUniversityCsvUploadParams = {
  fetchUniversities: () => Promise<void>;
};

const rankOptions = ['', 'S', 'A', 'B', 'C', 'D'];

export const useUniversityCsvUpload = ({
  fetchUniversities,
}: UseUniversityCsvUploadParams) => {
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
        const name = String(row['大学名'] || '').trim();
        return !name;
      });

      if (invalidRows.length > 0) {
        const firstInvalidRow = invalidRows[0];
        const rowIndex = validCsvData.indexOf(firstInvalidRow);
        const allKeys = Object.keys(firstInvalidRow);

        throw new Error(
          `必須項目が不足している行があります: ${invalidRows.length}件。例: 行${
            rowIndex + 1
          }の列名=[${allKeys.join(', ')}]`,
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

  const convertCsvRowToUniversity = useCallback(
    (
      row: Record<string, string>,
      isEdit: boolean,
    ): {
      id?: string;
      name: string;
      rank?: UniversityRankLevel;
    } => {
      const rankValue = String(row['学校ランク'] || '').trim();
      const rank = rankOptions.includes(rankValue)
        ? (rankValue as UniversityRankLevel | '')
        : '';

      return {
        ...(isEdit && { id: row['ID'] }),
        name: row['大学名'],
        rank: rank || undefined,
      };
    },
    [],
  );

  const handleBulkEdit = useCallback(
    async (
      universities: Array<{
        id: string;
        name: string;
        rank?: UniversityRankLevel;
      }>,
    ) => {
      const universityChunks = chunk(universities, 50);
      let succeeded = 0;
      let failed = 0;

      for (const universityChunk of universityChunks) {
        const results = await Promise.allSettled(
          universityChunk.map((university) =>
            apiClient<UniversityResponseDto>('/universities', {
              method: 'PUT',
              body: {
                id: university.id,
                name: university.name,
                rank: university.rank,
              },
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
      }

      await fetchUniversities();
      if (failed > 0) {
        toast.error(`${succeeded}件成功、${failed}件失敗しました`);
      } else {
        toast.success(`大学を${succeeded}件更新しました`);
      }
    },
    [fetchUniversities],
  );

  const handleBulkCreate = useCallback(
    async (
      universities: Array<{
        name: string;
        rank?: UniversityRankLevel;
      }>,
    ) => {
      const universityChunks = chunk(universities, 50);
      let succeeded = 0;
      let failed = 0;

      for (const universityChunk of universityChunks) {
        const results = await Promise.allSettled(
          universityChunk.map((university) =>
            apiClient<UniversityResponseDto>('/universities', {
              method: 'POST',
              body: {
                name: university.name,
                rank: university.rank,
              },
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
      }

      await fetchUniversities();
      if (failed > 0) {
        toast.error(`${succeeded}件成功、${failed}件失敗しました`);
      } else {
        toast.success(`大学を${succeeded}件登録しました`);
      }
    },
    [fetchUniversities],
  );

  const handleUploadCSV = useCallback(
    async (file: File, isEdit: boolean) => {
      try {
        validateFileType(file);

        const csvData = await parseCSV(file);
        const validCsvData = validateCsvData(csvData, isEdit);

        const universities = validCsvData.map((row) =>
          convertCsvRowToUniversity(row, isEdit),
        );

        if (isEdit) {
          await handleBulkEdit(
            universities as Parameters<typeof handleBulkEdit>[0],
          );
        } else {
          await handleBulkCreate(
            universities as Parameters<typeof handleBulkCreate>[0],
          );
        }
      } catch (err) {
        const message = extractErrorMessage(err, errorMessages.csvUploadFailed);
        throw new Error(message);
      }
    },
    [handleBulkEdit, handleBulkCreate, convertCsvRowToUniversity],
  );

  return {
    handleUploadCSV,
  };
};
