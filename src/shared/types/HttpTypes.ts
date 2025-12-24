import { languageVariants } from '../constants';

export interface RequestOptions extends RequestInit {
  method: string;
  headers: HeadersInit;
  body?: string | FormData;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  status?: number;
  errorMessage?: string;
  code?: number;
  success?: boolean;
}

export interface HttpResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

export type LangKey = keyof typeof languageVariants;
