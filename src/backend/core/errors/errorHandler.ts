import { AppError } from './AppError';
import { logger } from '../logging/logger';
import { buildErrorResponse } from '../response/responseBuilder';

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    logger.warn({ err: error }, `Operational error: ${error.message}`);
    return buildErrorResponse(error.message, error.code, error.statusCode);
  }

  logger.error({ err: error }, 'Unhandled exception');
  return buildErrorResponse('Internal Server Error', 'INTERNAL_ERROR', 500);
}
