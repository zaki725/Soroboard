import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import { parseCSV } from '@/libs/csv-parse';
import { chunk } from '@/libs/array-utils';
import type { EventResponseDto } from '@/types/event';
import { convertDateTimeLocalToISO } from '@/libs/date-utils';

type UseEventCsvUploadParams = {
  fetchEvents: () => Promise<void>;
};

export const useEventCsvUpload = ({ fetchEvents }: UseEventCsvUploadParams) => {
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
        const eventMasterId = String(row['イベントマスターID'] || '').trim();
        const locationId = String(row['ロケーションID'] || '').trim();
        const startTime = String(row['開始時刻'] || '').trim();
        return !eventMasterId || !locationId || !startTime;
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

    // 編集モードでのID存在チェック
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

  const convertCsvRowToEvent = useCallback(
    (
      row: Record<string, string>,
      isEdit: boolean,
    ): {
      id?: string;
      startTime: string;
      endTime: string | null;
      notes: string | null;
      eventMasterId: string;
      locationId: string;
      address: string | null;
      interviewerIds?: string[];
    } => {
      const startTime = String(row['開始時刻'] || '').trim();
      const endTime = String(row['終了時刻'] || '').trim() || null;
      const notes = String(row['備考'] || '').trim() || null;
      const address = String(row['開催場所'] || '').trim() || null;
      const interviewerIdsStr = String(
        row['面接官ID（カンマ区切り）'] || '',
      ).trim();

      // datetime-local形式をISO形式に変換
      const startTimeISO = convertDateTimeLocalToISO(startTime);
      const endTimeISO = endTime ? convertDateTimeLocalToISO(endTime) : null;

      if (!startTimeISO) {
        throw new Error('開始時刻は必須です');
      }

      // 面接官IDをカンマ区切りから配列に変換
      const interviewerIds = interviewerIdsStr
        ? interviewerIdsStr
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean)
        : undefined;

      return {
        ...(isEdit && { id: row['ID'] }),
        startTime: startTimeISO,
        endTime: endTimeISO,
        notes,
        eventMasterId: String(row['イベントマスターID'] || '').trim(),
        locationId: String(row['ロケーションID'] || '').trim(),
        address,
        interviewerIds,
      };
    },
    [],
  );

  const handleBulkEdit = useCallback(
    async (
      events: Array<{
        id: string;
        startTime: string;
        endTime: string | null;
        notes: string | null;
        eventMasterId: string;
        locationId: string;
        address: string | null;
        interviewerIds?: string[];
      }>,
    ) => {
      const eventChunks = chunk(events, 50);
      let succeeded = 0;
      let failed = 0;

      for (const eventChunk of eventChunks) {
        const results = await Promise.allSettled(
          eventChunk.map((event) =>
            apiClient<EventResponseDto>('/events', {
              method: 'PUT',
              body: {
                id: event.id,
                startTime: event.startTime,
                endTime: event.endTime,
                notes: event.notes,
                locationId: event.locationId,
                address: event.address,
                interviewerIds: event.interviewerIds || [],
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

      await fetchEvents();
      if (failed > 0) {
        toast.error(`${succeeded}件成功、${failed}件失敗しました`);
      } else {
        toast.success(`イベントを${succeeded}件更新しました`);
      }
    },
    [fetchEvents],
  );

  const handleBulkCreate = useCallback(
    async (
      events: Array<{
        startTime: string;
        endTime: string | null;
        notes: string | null;
        eventMasterId: string;
        locationId: string;
        address: string | null;
        interviewerIds?: string[];
      }>,
    ) => {
      await apiClient<EventResponseDto[]>('/events/bulk', {
        method: 'POST',
        body: { events },
      });

      await fetchEvents();
      toast.success(`イベントを${events.length}件登録しました`);
    },
    [fetchEvents],
  );

  const handleUploadCSV = useCallback(
    async (file: File, isEdit: boolean) => {
      try {
        validateFileType(file);

        const csvData = await parseCSV(file);
        const validCsvData = validateCsvData(csvData, isEdit);

        const events = validCsvData.map((row) =>
          convertCsvRowToEvent(row, isEdit),
        );

        if (isEdit) {
          await handleBulkEdit(events as Parameters<typeof handleBulkEdit>[0]);
        } else {
          await handleBulkCreate(
            events as Parameters<typeof handleBulkCreate>[0],
          );
        }
      } catch (err) {
        const message = extractErrorMessage(err, errorMessages.csvUploadFailed);
        throw new Error(message);
      }
    },
    [handleBulkEdit, handleBulkCreate, convertCsvRowToEvent],
  );

  return {
    handleUploadCSV,
  };
};
