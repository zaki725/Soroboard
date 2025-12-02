import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import { parseCSV } from '@/libs/csv-parse';
import { chunk } from '@/libs/array-utils';
import type { EventMasterResponseDto } from '@/types/event-master';
import { useRecruitYear } from '@/contexts/RecruitYearContext';
import { LOCATION_TYPES } from '@/constants/enums';

type UseEventMasterCsvUploadParams = {
  refetch: () => Promise<void>;
};

export const useEventMasterCsvUpload = ({
  refetch,
}: UseEventMasterCsvUploadParams) => {
  const { selectedRecruitYear } = useRecruitYear();

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
        const name = String(row['イベント名'] || '').trim();
        const type = String(row['タイプ'] || '').trim();
        return !name || !type;
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

      // タイプのバリデーション
      const invalidTypeRows = validCsvData.filter((row) => {
        const type = String(row['タイプ'] || '').trim();
        return !LOCATION_TYPES.includes(
          type as (typeof LOCATION_TYPES)[number],
        );
      });

      if (invalidTypeRows.length > 0) {
        throw new Error(
          `無効なタイプがあります。タイプは「${LOCATION_TYPES.join(
            '」「',
          )}」のいずれかである必要があります。`,
        );
      }

      // イベント名の重複チェック
      const names = validCsvData.map((row) =>
        String(row['イベント名'] ?? '').trim(),
      );
      const duplicates = names.filter(
        (name, index) => names.indexOf(name) !== index,
      );
      if (duplicates.length > 0) {
        throw new Error(
          `重複するイベント名があります: ${duplicates.join(', ')}`,
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

      // タイプのバリデーション
      const invalidTypeRows = validCsvData.filter((row) => {
        const type = String(row['タイプ'] || '').trim();
        return !LOCATION_TYPES.includes(
          type as (typeof LOCATION_TYPES)[number],
        );
      });

      if (invalidTypeRows.length > 0) {
        throw new Error(
          `無効なタイプがあります。タイプは「${LOCATION_TYPES.join(
            '」「',
          )}」のいずれかである必要があります。`,
        );
      }
    }

    return validCsvData;
  };

  const convertCsvRowToEventMaster = useCallback(
    (
      row: Record<string, string>,
      isEdit: boolean,
    ): {
      id?: string;
      name: string;
      description: string | null;
      type: string;
    } => {
      const name = String(row['イベント名'] || '').trim();
      const description = String(row['説明'] || '').trim() || null;
      const type = String(row['タイプ'] || '').trim();

      return {
        ...(isEdit && { id: String(row['ID'] ?? '').trim() }),
        name,
        description,
        type,
      };
    },
    [],
  );

  const handleBulkEdit = useCallback(
    async (
      eventMasters: Array<{
        id: string;
        name: string;
        description: string | null;
        type: string;
      }>,
    ) => {
      const eventMasterChunks = chunk(eventMasters, 50);
      let succeeded = 0;
      let failed = 0;

      for (const eventMasterChunk of eventMasterChunks) {
        const results = await Promise.allSettled(
          eventMasterChunk.map((eventMaster) =>
            apiClient<EventMasterResponseDto>('/event-masters', {
              method: 'PUT',
              body: {
                id: eventMaster.id,
                name: eventMaster.name,
                description: eventMaster.description,
                type: eventMaster.type,
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

      await refetch();
      if (failed > 0) {
        toast.error(`${succeeded}件成功、${failed}件失敗しました`);
      } else {
        toast.success(`イベントマスターを${succeeded}件更新しました`);
      }
    },
    [refetch],
  );

  const handleBulkCreate = useCallback(
    async (
      eventMasters: Array<{
        name: string;
        description: string | null;
        type: string;
      }>,
    ) => {
      if (!selectedRecruitYear) {
        throw new Error('年度が選択されていません');
      }

      await apiClient<EventMasterResponseDto[]>('/event-masters/bulk', {
        method: 'POST',
        body: {
          eventMasters: eventMasters.map((em) => ({
            ...em,
            recruitYearId: selectedRecruitYear.recruitYear,
          })),
        },
      });

      await refetch();
      toast.success(`イベントマスターを${eventMasters.length}件登録しました`);
    },
    [refetch, selectedRecruitYear],
  );

  const handleUploadCSV = useCallback(
    async (file: File, isEdit: boolean) => {
      try {
        validateFileType(file);

        const csvData = await parseCSV(file);
        const validCsvData = validateCsvData(csvData, isEdit);

        const eventMasters = validCsvData.map((row) =>
          convertCsvRowToEventMaster(row, isEdit),
        );

        if (isEdit) {
          await handleBulkEdit(
            eventMasters as Parameters<typeof handleBulkEdit>[0],
          );
        } else {
          await handleBulkCreate(
            eventMasters as Parameters<typeof handleBulkCreate>[0],
          );
        }
      } catch (err) {
        const message = extractErrorMessage(err, errorMessages.csvUploadFailed);
        throw new Error(message);
      }
    },
    [handleBulkEdit, handleBulkCreate, convertCsvRowToEventMaster],
  );

  return {
    handleUploadCSV,
  };
};
