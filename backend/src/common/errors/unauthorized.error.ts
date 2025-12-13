import { ApplicationError } from './application-error';

/**
 * 認証エラー
 * 認証に失敗した場合や認証トークンが無効な場合に使用
 */
export class UnauthorizedError extends ApplicationError {
  constructor(message: string) {
    super(message, 401, 'UNAUTHORIZED');
  }
}

