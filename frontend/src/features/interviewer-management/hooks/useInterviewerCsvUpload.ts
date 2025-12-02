import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import { parseCSV } from '@/libs/csv-parse';
import type { InterviewerCategory } from '@/types/interviewer';
import { INTERVIEWER_CATEGORIES } from '@/constants/enums';
import type { UserResponseDto } from '@/types/user';

type UseInterviewerCsvUploadParams = {
  fetchInterviewers: () => Promise<void>;
  users: UserResponseDto[];
};

export const useInterviewerCsvUpload = ({
  fetchInterviewers,
  users,
}: UseInterviewerCsvUploadParams) => {
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

    // 必須フィールドの検証
    const invalidRows = validCsvData.filter((row) => {
      const id = String(row['ID'] || '').trim();
      const category = String(row['カテゴリ'] || '').trim();
      return !id || !category;
    });

    if (invalidRows.length > 0) {
      const firstInvalidRow = invalidRows[0];
      const rowIndex = validCsvData.indexOf(firstInvalidRow);

      throw new Error(
        `必須項目が不足している行があります: ${invalidRows.length}件。例: 行${
          rowIndex + 2
        }（IDまたはカテゴリが不足）`,
      );
    }

    // IDの重複チェック（トリミング後の値で判定）
    const ids = validCsvData.map((row) => String(row['ID'] ?? '').trim());
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicates.length > 0) {
      // 重複をSetでまとめてメッセージを読みやすくする
      const uniqueDuplicates = Array.from(new Set(duplicates));
      throw new Error(`重複するIDがあります: ${uniqueDuplicates.join(', ')}`);
    }

    // カテゴリの検証
    const invalidCategoryRows = validCsvData.filter((row) => {
      const category = String(row['カテゴリ'] || '').trim();
      return !INTERVIEWER_CATEGORIES.includes(category as InterviewerCategory);
    });

    if (invalidCategoryRows.length > 0) {
      throw new Error(
        `無効なカテゴリがあります。カテゴリは「フロント」または「現場社員」である必要があります。`,
      );
    }

    return validCsvData;
  };

  const convertCsvRowToInterviewer = useCallback(
    (
      row: Record<string, string>,
      users: UserResponseDto[],
    ): { userId: string; category: InterviewerCategory } | null => {
      const id = String(row['ID'] || '').trim();
      const category = String(
        row['カテゴリ'] || '',
      ).trim() as InterviewerCategory;

      // IDでユーザーを検索
      const user = users.find((u) => u.id === id);

      if (!user) {
        // ユーザーが見つからない場合はnullを返す（エラー処理は別途）
        return null;
      }

      return {
        userId: user.id,
        category,
      };
    },
    [],
  );

  const handleBulkCreate = useCallback(
    async (
      interviewers: Array<{
        userId: string;
        category: InterviewerCategory;
      }>,
    ) => {
      await apiClient<unknown>('/interviewers/bulk', {
        method: 'POST',
        body: { interviewers },
      });

      await fetchInterviewers();
      toast.success(`面接官を${interviewers.length}件登録しました`);
    },
    [fetchInterviewers],
  );

  const handleBulkUpdate = useCallback(
    async (
      interviewers: Array<{
        userId: string;
        category: InterviewerCategory;
      }>,
    ) => {
      await apiClient<unknown>('/interviewers/bulk', {
        method: 'PUT',
        body: { interviewers },
      });

      await fetchInterviewers();
      toast.success(`面接官を${interviewers.length}件更新しました`);
    },
    [fetchInterviewers],
  );

  const convertCsvRowToInterviewerForEdit = useCallback(
    (
      row: Record<string, string>,
    ): { userId: string; category: InterviewerCategory } | null => {
      const id = String(row['ID'] || '').trim();
      const category = String(
        row['カテゴリ'] || '',
      ).trim() as InterviewerCategory;

      if (!id || !category) {
        return null;
      }

      return {
        userId: id,
        category,
      };
    },
    [],
  );

  const handleUploadCSV = useCallback(
    async (file: File, isEdit: boolean) => {
      try {
        validateFileType(file);

        const csvData = await parseCSV(file);
        const validCsvData = validateCsvData(csvData);

        if (isEdit) {
          // 一括編集の場合
          const interviewersWithNull = validCsvData.map((row) =>
            convertCsvRowToInterviewerForEdit(row),
          );

          // IDまたはカテゴリが不足している行をチェック
          const invalidRows = validCsvData
            .map((row, index) => ({
              id: String(row['ID'] || '').trim(),
              index,
            }))
            .filter((item, index) => interviewersWithNull[index] === null);

          if (invalidRows.length > 0) {
            throw new Error(
              `必須項目が不足している行があります: ${
                invalidRows.length
              }件。例: 行${invalidRows[0].index + 2}（IDまたはカテゴリが不足）`,
            );
          }

          const interviewers = interviewersWithNull.filter(
            (item): item is { userId: string; category: InterviewerCategory } =>
              item !== null,
          );

          if (interviewers.length === 0) {
            throw new Error('更新可能な面接官が見つかりませんでした');
          }

          await handleBulkUpdate(interviewers);
        } else {
          // 一括登録の場合
          // IDでユーザーを検索して面接官データに変換
          const interviewersWithNull = validCsvData.map((row) =>
            convertCsvRowToInterviewer(row, users),
          );

          // ユーザーが見つからないIDをチェック
          const notFoundIds = validCsvData
            .map((row, index) => ({
              id: String(row['ID'] || '').trim(),
              index,
            }))
            .filter((item, index) => interviewersWithNull[index] === null);

          if (notFoundIds.length > 0) {
            throw new Error(
              `以下のIDはユーザーとして登録されていません: ${notFoundIds
                .map((item) => item.id)
                .join(', ')}`,
            );
          }

          const interviewers = interviewersWithNull.filter(
            (item): item is { userId: string; category: InterviewerCategory } =>
              item !== null,
          );

          if (interviewers.length === 0) {
            throw new Error('登録可能な面接官が見つかりませんでした');
          }

          await handleBulkCreate(interviewers);
        }
      } catch (err) {
        const message = extractErrorMessage(err, errorMessages.csvUploadFailed);
        throw new Error(message);
      }
    },
    [
      convertCsvRowToInterviewer,
      convertCsvRowToInterviewerForEdit,
      handleBulkCreate,
      handleBulkUpdate,
      users,
    ],
  );

  return {
    handleUploadCSV,
  };
};
