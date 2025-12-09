/**
 * 認証エラーメッセージの定数定義
 */

/**
 * 認証失敗時のエラーメッセージを生成する関数
 * @param email メールアドレス
 * @returns エラーメッセージ（例: 'メールアドレスまたはパスワードが正しくありません - email: user@example.com'）
 */
export const getInvalidCredentials = (email: string): string =>
  `メールアドレスまたはパスワードが正しくありません - email: ${email}`;

