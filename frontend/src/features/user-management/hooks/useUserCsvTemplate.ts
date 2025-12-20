import { useCallback } from 'react';
import { formatDateToISOString } from '@/libs/date-utils';
import { downloadExcel } from '@/libs/excel-utils';
import { roleLabelMap, genderLabelMap } from '../constants/user.constants';
import {
  userCreateTemplateExcelHeaders,
  userEditTemplateExcelHeaders,
} from '../constants/user-excel.constants';
// department-management機能は削除されたため、部署フィールドは無効化
import { apiClient } from '@/libs/api-client';
import type { UserResponseDto } from '@/types/user';
import { extractErrorMessage } from '@/libs/error-handler';
import toast from 'react-hot-toast';

export const useUserCsvTemplate = () => {
  // department-management機能は削除されたため、部署名は空配列
  const departmentNames: string[] = [];

  const fetchAllUsers = useCallback(async (): Promise<UserResponseDto[]> => {
    try {
      // /users/exportエンドポイントで全ユーザーを取得
      const allUsers = await apiClient<UserResponseDto[]>('/users/export');
      return allUsers;
    } catch (err) {
      const message = extractErrorMessage(
        err,
        'ユーザー一覧の取得に失敗しました',
      );
      toast.error(message);
      throw new Error(message);
    }
  }, []);

  const handleDownloadTemplateCSV = useCallback(async () => {
    const templateData = [
      {
        メールアドレス: 'example@example.com',
        姓: '山田',
        名: '太郎',
        権限: 'ユーザー',
        性別: '男性',
        部署: '',
      },
    ];

    const filename = `ユーザー登録テンプレート_${formatDateToISOString()}.xlsx`;
    await downloadExcel({
      data: templateData,
      headers: userCreateTemplateExcelHeaders(departmentNames),
      filename,
      sheetName: 'ユーザー登録',
    });
  }, [departmentNames]);

  const handleDownloadEditTemplateCSV = useCallback(async () => {
    try {
      const allUsers = await fetchAllUsers();
      const templateData = allUsers.map((user) => ({
        ID: user.id,
        メールアドレス: user.email,
        姓: user.lastName,
        名: user.firstName,
        権限: roleLabelMap[user.role],
        性別: user.gender ? genderLabelMap[user.gender] : '',
        部署: user.departmentName || '',
      }));

      const filename = `ユーザー編集テンプレート_${formatDateToISOString()}.xlsx`;
      await downloadExcel({
        data: templateData,
        headers: userEditTemplateExcelHeaders(departmentNames),
        filename,
        sheetName: 'ユーザー編集',
      });
    } catch {
      // エラーはfetchAllUsers内で処理済み
    }
  }, [fetchAllUsers, departmentNames]);

  return {
    handleDownloadTemplateCSV,
    handleDownloadEditTemplateCSV,
  };
};
