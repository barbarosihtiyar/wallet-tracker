import { ToastFunction } from '@/components';
import { appConfig } from '@/shared/config';
import { languageVariants } from '@/shared/constants';
import { buildPaginationQuery } from '@/shared/lib/pagination';
import i18n from '@/shared/i18n';
import type { ApiResponse, LangKey } from '@/shared/types/HttpTypes';

export interface ApiError extends Error {
  status: number;
  path: string;
  details?: unknown;
}

export const createApiError = (
  message: string,
  status: number,
  path: string,
  details?: unknown
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

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestConfig<TBody = unknown> = {
  path: string;
  method?: HttpMethod;
  data?: TBody;
  params?: Record<string, unknown>;
  signal?: AbortSignal;
  headers?: Record<string, string>;
  /**
   * Optional offline fallback. Useful when network fails but
   * we still want to render cached/mock data.
   */
  fallbackData?: () => ApiResponse;
  fallbackMessageKey?: string;
  timeout?: number;
};

const isAbortError = (error: unknown) => {
  return (
    error instanceof DOMException ||
    (error as Error)?.name === 'AbortError' ||
    (error as Error)?.message === 'Aborted'
  );
};

const mergeSignals = (signals: (AbortSignal | undefined)[]): AbortSignal => {
  const controller = new AbortController();

  signals.forEach(signal => {
    if (!signal) return;
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', () => controller.abort());
    }
  });

  return controller.signal;
};

const buildUrl = (path: string, params?: Record<string, unknown>) => {
  const base = appConfig.apiBaseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const query = params ? buildPaginationQuery(params) : '';
  return `${base}${normalizedPath}${query}`;
};

const defaultHeaders = () => {
  const selectedLang = localStorage.getItem('i18nextLng') as LangKey | null;
  const langKey: LangKey = (selectedLang ?? 'en') as LangKey;

  return {
    accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Language': languageVariants[langKey] || 'tr-TR',
  } as Record<string, string>;
};

export const apiClient = {
  async request<T = unknown, TBody = unknown>({
    path,
    method = 'GET',
    data,
    params,
    signal,
    headers,
    fallbackData,
    fallbackMessageKey = 'general.fallback',
    timeout = appConfig.apiTimeout,
  }: RequestConfig<TBody>): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const mergedSignal = mergeSignals([signal, controller.signal]);
    const timeoutId =
      timeout && Number.isFinite(timeout)
        ? window.setTimeout(() => controller.abort(), timeout)
        : undefined;

    try {
      const url = buildUrl(path, params);
      const isFormData = data instanceof FormData;
      const requestInit: RequestInit = {
        method,
        headers: {
          ...defaultHeaders(),
          ...headers,
        },
        signal: mergedSignal,
      };

      if (data && method !== 'GET') {
        requestInit.body = isFormData
          ? (data as BodyInit)
          : JSON.stringify(data);
        if (isFormData) {
          delete (requestInit.headers as Record<string, string>)[
            'Content-Type'
          ];
        }
      }

      const response = await fetch(url, requestInit);
      const contentType = response.headers.get('content-type');
      const payload = contentType?.includes('application/json')
        ? await response.json()
        : undefined;

      if (!response.ok) {
        const message =
          payload?.errorMessage ||
          payload?.message ||
          i18n.t('general.error.desc');

        if (response.status === 401) {
          const unauthorizedMessage =
            payload?.errorMessage ||
            payload?.message ||
            i18n.t('general.error.unauthorized');
          throw createApiError(
            unauthorizedMessage,
            response.status,
            url,
            payload
          );
        }

        throw createApiError(message, response.status, url, payload);
      }

      const hasPaginationInfo =
        payload?.page || payload?.pageSize || payload?.total;
      const responseData = (
        hasPaginationInfo ? payload : (payload?.data ?? payload)
      ) as T;

      return {
        data: responseData,
        message: payload?.message,
        status: payload?.status ?? response.status,
        success: payload?.success ?? response.ok,
      };
    } catch (error) {
      if (isAbortError(error)) {
        throw error;
      }

      if (fallbackData && !isApiError(error)) {
        ToastFunction(
          i18n.t('general.error.title'),
          i18n.t(fallbackMessageKey),
          'warning'
        );
        return fallbackData() as ApiResponse<T>;
      }

      const message =
        error instanceof Error ? error.message : i18n.t('general.error.desc');
      throw createApiError(message, 0, path, error);
    } finally {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    }
  },

  get<T = unknown>(
    path: string,
    config?: Omit<RequestConfig, 'method' | 'path'>
  ) {
    return this.request<T>({ ...config, path, method: 'GET' });
  },

  post<T = unknown, TBody = unknown>(
    path: string,
    data?: TBody,
    config?: Omit<RequestConfig, 'method' | 'data' | 'path'>
  ) {
    return this.request<T, TBody>({ ...config, path, data, method: 'POST' });
  },

  put<T = unknown, TBody = unknown>(
    path: string,
    data?: TBody,
    config?: Omit<RequestConfig, 'method' | 'data' | 'path'>
  ) {
    return this.request<T, TBody>({ ...config, path, data, method: 'PUT' });
  },

  patch<T = unknown, TBody = unknown>(
    path: string,
    data?: TBody,
    config?: Omit<RequestConfig, 'method' | 'data' | 'path'>
  ) {
    return this.request<T, TBody>({ ...config, path, data, method: 'PATCH' });
  },

  delete<T = unknown, TBody = unknown>(
    path: string,
    data?: TBody,
    config?: Omit<RequestConfig, 'method' | 'data' | 'path'>
  ) {
    return this.request<T, TBody>({ ...config, path, data, method: 'DELETE' });
  },
};

export type ApiClient = typeof apiClient;
