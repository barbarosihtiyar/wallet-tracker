import { GeneralModalFunction, ToastFunction } from '@/components';
import i18n from '@/shared/i18n';

export interface ApiError extends Error {
  status: number;
  path: string;
  details?: unknown;
}

export const createApiError = (
  message: string,
  status: number,
  path: string,
  details?: unknown,
): ApiError => {
  const error = new Error(message) as ApiError;
  error.name = 'ApiError';
  error.status = status;
  error.path = path;
  error.details = details;
  return error;
};

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof Error && error.name === 'ApiError';
};
export const extractErrorMessage = (
  error: unknown,
  fallbackKey: string = 'general.error.desc',
): string => {
  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message || i18n.t(fallbackKey);
  }

  return i18n.t(fallbackKey);
};

export const notifyError = (
  error: unknown,
  titleKey: string = 'general.error.title',
  fallbackKey: string = 'general.error.desc',
) => {
  const message = extractErrorMessage(error, fallbackKey);
  const title = i18n.t(titleKey);

  GeneralModalFunction('warning', message, title);
  ToastFunction(title, message, 'warning');
};
