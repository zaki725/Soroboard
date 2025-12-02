import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '@/libs/api-client';
import { extractErrorMessage } from '@/libs/error-handler';
import { errorMessages } from '@/constants/error-messages';
import { parseCSV } from '@/libs/csv-parse';
import { chunk } from '@/libs/array-utils';
import type { CompanyResponseDto } from '@/types/company';

type UseCompanyCsvUploadParams = {
  fetchCompanies: () => Promise<void>;
  selectedRecruitYearId: number;
};

export const useCompanyCsvUpload = ({
  fetchCompanies,
  selectedRecruitYearId,
}: UseCompanyCsvUploadParams) => {
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
        const name = String(row['会社名'] || '').trim();
        return !name;
      });

      if (invalidRows.length > 0) {
        throw new Error(
          `必須項目が不足している行があります: ${invalidRows.length}件`,
        );
      }

      // 会社名の重複チェック
      const names = validCsvData.map((row) => row['会社名']);
      const duplicates = names.filter(
        (name, index) => names.indexOf(name) !== index,
      );
      if (duplicates.length > 0) {
        throw new Error(`重複する会社名があります: ${duplicates.join(', ')}`);
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

  const convertCsvRowToCompany = useCallback(
    (
      row: Record<string, string>,
      isEdit: boolean,
    ): {
      id?: string;
      name: string;
      phoneNumber: string | null;
      email: string | null;
      websiteUrl: string | null;
      recruitYearId: number;
    } => {
      return {
        ...(isEdit && { id: row['ID'] }),
        name: row['会社名'],
        phoneNumber: row['電話番号'] || null,
        email: row['メールアドレス'] || null,
        websiteUrl: row['WEBサイトURL'] || null,
        recruitYearId: selectedRecruitYearId,
      };
    },
    [selectedRecruitYearId],
  );

  const handleBulkEdit = useCallback(
    async (
      companies: Array<{
        id: string;
        name: string;
        phoneNumber: string | null;
        email: string | null;
        websiteUrl: string | null;
        recruitYearId: number;
      }>,
    ) => {
      const companyChunks = chunk(companies, 50);
      let succeeded = 0;
      let failed = 0;

      for (const companyChunk of companyChunks) {
        const results = await Promise.allSettled(
          companyChunk.map((company) =>
            apiClient<CompanyResponseDto>('/companies', {
              method: 'PUT',
              body: company,
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

      await fetchCompanies();
      if (failed > 0) {
        toast.error(`${succeeded}件成功、${failed}件失敗しました`);
      } else {
        toast.success(`会社を${succeeded}件更新しました`);
      }
    },
    [fetchCompanies],
  );

  const handleBulkCreate = useCallback(
    async (
      companies: Array<{
        name: string;
        phoneNumber: string | null;
        email: string | null;
        websiteUrl: string | null;
        recruitYearId: number;
      }>,
    ) => {
      const companyChunks = chunk(companies, 50);
      let succeeded = 0;
      let failed = 0;

      for (const companyChunk of companyChunks) {
        const results = await Promise.allSettled(
          companyChunk.map((company) =>
            apiClient<CompanyResponseDto>('/companies', {
              method: 'POST',
              body: company,
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

      await fetchCompanies();
      if (failed > 0) {
        toast.error(`${succeeded}件成功、${failed}件失敗しました`);
      } else {
        toast.success(`会社を${succeeded}件登録しました`);
      }
    },
    [fetchCompanies],
  );

  const handleUploadCSV = useCallback(
    async (file: File, isEdit: boolean) => {
      try {
        validateFileType(file);

        const csvData = await parseCSV(file);
        const validCsvData = validateCsvData(csvData, isEdit);

        const companies = validCsvData.map((row) =>
          convertCsvRowToCompany(row, isEdit),
        );

        if (isEdit) {
          await handleBulkEdit(
            companies as Array<{
              id: string;
              name: string;
              phoneNumber: string | null;
              email: string | null;
              websiteUrl: string | null;
              recruitYearId: number;
            }>,
          );
        } else {
          await handleBulkCreate(
            companies as Array<{
              name: string;
              phoneNumber: string | null;
              email: string | null;
              websiteUrl: string | null;
              recruitYearId: number;
            }>,
          );
        }
      } catch (err) {
        const message = extractErrorMessage(err, errorMessages.csvUploadFailed);
        throw new Error(message);
      }
    },
    [handleBulkEdit, handleBulkCreate, convertCsvRowToCompany],
  );

  return {
    handleUploadCSV,
  };
};
