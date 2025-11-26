import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import { parseCSV } from '@/libs/csv-parse';
import { chunk } from '@/libs/array-utils';
import type { EventLocationResponseDto } from '@/types/event-location';

type UseEventLocationCsvUploadParams = {
  fetchEventLocations: () => Promise<void>;
};

export const useEventLocationCsvUpload = ({
  fetchEventLocations,
}: UseEventLocationCsvUploadParams) => {
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
    // 空行を除外
    const validCsvData = csvData.filter((row) => {
      const hasAnyValue = Object.values(row).some(
        (value) => String(value || '').trim() !== '',
      );
      return hasAnyValue;
    });

    if (validCsvData.length === 0) {
      throw new Error('CSVファイルにデータが含まれていません');
    }

    // 必須フィールドの検証（作成モード）
    if (!isEdit) {
      const invalidRows = validCsvData.filter((row) => {
        const name = String(row['ロケーション名'] || '').trim();
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

      // ロケーション名の重複チェック
      const names = validCsvData.map((row) =>
        String(row['ロケーション名'] ?? '').trim(),
      );
      const duplicates = names.filter(
        (name, index) => names.indexOf(name) !== index,
      );
      if (duplicates.length > 0) {
        throw new Error(
          `重複するロケーション名があります: ${duplicates.join(', ')}`,
        );
      }
    }

    // 編集モードでのID存在チェック
    if (isEdit) {
      const invalidRows = validCsvData.filter((row) => {
        const id = String(row['ID'] ?? '').trim();
        return !id;
      });
      if (invalidRows.length > 0) {
        throw new Error(
          `IDが不足している行があります: ${invalidRows.length}件`,
        );
      }

      // IDの重複チェック
      const ids = validCsvData.map((row) => String(row['ID'] ?? '').trim());
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
      if (duplicates.length > 0) {
        throw new Error(`重複するIDがあります: ${duplicates.join(', ')}`);
      }
    }

    return validCsvData;
  };

  const convertCsvRowToEventLocation = useCallback(
    (
      row: Record<string, string>,
      isEdit: boolean,
    ): {
      id?: string;
      name: string;
    } => {
      const name = String(row['ロケーション名'] || '').trim();

      return {
        ...(isEdit && { id: String(row['ID'] ?? '').trim() }),
        name,
      };
    },
    [],
  );

  const handleBulkEdit = useCallback(
    async (
      eventLocations: Array<{
        id: string;
        name: string;
      }>,
    ) => {
      const eventLocationChunks = chunk(eventLocations, 50);
      let succeeded = 0;
      let failed = 0;

      for (const eventLocationChunk of eventLocationChunks) {
        const results = await Promise.allSettled(
          eventLocationChunk.map((eventLocation) =>
            apiClient<EventLocationResponseDto>('/event-locations', {
              method: 'PUT',
              body: {
                id: eventLocation.id,
                name: eventLocation.name,
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

      await fetchEventLocations();
      if (failed > 0) {
        toast.error(`${succeeded}件成功、${failed}件失敗しました`);
      } else {
        toast.success(`ロケーションを${succeeded}件更新しました`);
      }
    },
    [fetchEventLocations],
  );

  const handleBulkCreate = useCallback(
    async (
      eventLocations: Array<{
        name: string;
      }>,
    ) => {
      try {
        await apiClient<EventLocationResponseDto[]>('/event-locations/bulk', {
          method: 'POST',
          body: { eventLocations },
        });

        await fetchEventLocations();
        toast.success(`ロケーションを${eventLocations.length}件登録しました`);
      } catch (err) {
        const message = extractErrorMessage(
          err,
          'ロケーションの一括登録に失敗しました',
        );
        toast.error(message);
        throw new Error(message);
      }
    },
    [fetchEventLocations],
  );

  const handleUploadCSV = useCallback(
    async (file: File, isEdit: boolean) => {
      try {
        validateFileType(file);

        const csvData = await parseCSV(file);
        const validCsvData = validateCsvData(csvData, isEdit);

        const eventLocations = validCsvData.map((row) =>
          convertCsvRowToEventLocation(row, isEdit),
        );

        if (isEdit) {
          await handleBulkEdit(
            eventLocations as Parameters<typeof handleBulkEdit>[0],
          );
        } else {
          await handleBulkCreate(
            eventLocations as Parameters<typeof handleBulkCreate>[0],
          );
        }
      } catch (err) {
        const message = extractErrorMessage(err, errorMessages.csvUploadFailed);
        throw new Error(message);
      }
    },
    [handleBulkEdit, handleBulkCreate, convertCsvRowToEventLocation],
  );

  return {
    handleUploadCSV,
  };
};
