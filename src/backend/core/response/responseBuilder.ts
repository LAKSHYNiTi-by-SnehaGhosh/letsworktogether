export interface StandardResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: {
    message: string;
    code: string;
  } | null;
  meta?: unknown;
}

export function buildSuccessResponse<T>(data: T, meta?: unknown): StandardResponse<T> {
  return {
    success: true,
    data,
    error: null,
    ...(meta ? { meta } : {})
  };
}

export function buildErrorResponse(message: string, code = 'ERROR', statusCode = 500): StandardResponse<null> & { statusCode: number } {
  return {
    success: false,
    data: null,
    error: {
      message,
      code,
    },
    statusCode
  };
}
