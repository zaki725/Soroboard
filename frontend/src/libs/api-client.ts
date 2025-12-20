import { errorMessages } from '@/constants/error-messages';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  cache?: RequestCache;
};

export type ApiError = {
  statusCode: number;
  errorCode?: string;
  message: string;
  timestamp?: string;
  details?: Array<{
    path: (string | number)[];
    message: string;
  }>;
};

export class ApiClientError extends Error {
  constructor(
    public statusCode: number,
    public errorCode: string | undefined,
    message: string,
    public details?: Array<{
      path: (string | number)[];
      message: string;
    }>,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export const apiClient = async <T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { method = 'GET', headers = {}, body, cache } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    cache,
    credentials: 'include', // セッションCookieを送信するために必要
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      statusCode: response.status,
      message: errorMessages.requestFailed,
    }));

    const statusCode = errorData.statusCode || response.status;
    const errorMessageMap: Record<number, string> = {
      500: errorMessages.unexpectedError,
    };

    const message =
      errorMessageMap[statusCode] ||
      errorData.message ||
      `HTTP error! status: ${statusCode}`;

    throw new ApiClientError(
      statusCode,
      errorData.errorCode,
      message,
      errorData.details,
    );
  }

  // 204 No Content の場合は undefined を返す（void型との互換性のため）
  if (response.status === 204) {
    return undefined as T;
  }

  // レスポンステキストを取得
  const text = await response.text();
  if (!text || text.trim().length === 0) {
    throw new ApiClientError(
      response.status,
      undefined,
      errorMessages.responseEmpty,
    );
  }

  // JSONパースを試みる
  try {
    return JSON.parse(text) as T;
  } catch (parseError) {
    throw new ApiClientError(
      response.status,
      undefined,
      errorMessages.jsonParseFailed,
    );
  }
};
