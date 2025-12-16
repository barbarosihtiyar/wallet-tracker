import { Config } from '@/app/router/config';

type EnvKey =
  | 'VITE_API_BASE_URL'
  | 'VITE_API_TIMEOUT'
  | 'VITE_APP_ENV'
  | 'VITE_APP_VERSION';

const readEnv = (key: EnvKey, fallback?: string): string | undefined => {
  const env = (import.meta as ImportMeta).env as Record<
    string,
    string | undefined
  >;
  const value = env[key];
  if (value !== undefined && value !== null && value !== '') return value;

  if (key === 'VITE_APP_VERSION') return process.env.APP_VERSION || fallback;

  return fallback;
};

const normalizeBaseUrl = (url: string): string => {
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const appEnv = (readEnv('VITE_APP_ENV', process.env.NODE_ENV) ||
  'development') as string;

const apiBaseUrl = normalizeBaseUrl(
  readEnv('VITE_API_BASE_URL', 'https://frontend-case-study.onrender.com/api') ||
    '',
);

const apiTimeout = Number(readEnv('VITE_API_TIMEOUT', '12000'));

export const appConfig = {
  env: appEnv,
  apiBaseUrl,
  apiTimeout: Number.isFinite(apiTimeout) ? apiTimeout : 12000,
  version: readEnv('VITE_APP_VERSION', '0.0.0'),
  routes: Config,
} as const;

export type AppConfig = typeof appConfig;
