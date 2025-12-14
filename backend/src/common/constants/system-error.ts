/**
 * システムエラーメッセージの定数定義
 */

export const INTERNAL_SERVER_ERROR = 'システムエラーが発生しました';
export const VALIDATION_ERROR = 'バリデーションエラー';
export const SESSION_SECRET_REQUIRED =
  'SESSION_SECRET環境変数が設定されていません。';
export const CORS_ORIGIN_REQUIRED =
  'CORS_ORIGIN環境変数が設定されていません。本番環境では必須です。';
export const DATABASE_URL_REQUIRED =
  'DATABASE_URL環境変数が設定されていません。本番環境では必須です。';
export const USER_DATA_INTEGRITY_ERROR =
  'ユーザー情報の取得に失敗しました。データの整合性に問題があります。';
export const UNSUPPORTED_AUTH_USER_ROLE = (role: string): string =>
  `未対応のAuthUserRole: ${role}`;
