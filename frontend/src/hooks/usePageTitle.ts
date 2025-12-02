import { useEffect } from 'react';

/**
 * ページタイトルを設定するカスタムフック
 * @param title ページタイトル（例: "ユーザー管理"）
 */
export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = title ? `${title} | 採用管理システム` : '採用管理システム';
  }, [title]);
};
