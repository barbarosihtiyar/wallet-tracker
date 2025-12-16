import { TFunction } from 'i18next';
import type { RefObject } from 'react';

import { ToastFunction } from '@/components';
import i18n from '@/shared/i18n';

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  Object.prototype.toString.call(v) === '[object Object]';

export const hasContent = (v: unknown): boolean => {
  if (v == null) return false;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (v instanceof Map || v instanceof Set) return v.size > 0;
  if (isPlainObject(v)) return Object.keys(v).length > 0;

  return true;
};

export const isEmpty = (v: unknown) =>
  v === undefined || v === null || v === '';

export const removeEmptyFields = <T extends Record<string, unknown>>(
  obj: T,
): Partial<T> =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => !isEmpty(v)),
  ) as Partial<T>;

export const ensureArray = <T>(v: T | readonly T[] | null | undefined): T[] => {
  if (v == null) return [];
  if (Array.isArray(v)) return [...(v as readonly T[])];
  return [v as T];
};

export const encodeUrlData = (data: string[] | string): string => {
  const jsonString = JSON.stringify(data);
  return window
    .btoa(jsonString)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

export const decodeUrlData = (encodedData: string): string[] | string => {
  try {
    let base64 = encodedData.replace(/-/g, '+').replace(/_/g, '/');

    while (base64.length % 4) {
      base64 += '=';
    }

    const jsonString = window.atob(base64);
    return JSON.parse(jsonString);
  } catch {
    return [];
  }
};

export const getImageProxyUrl = (
  imagePath: string | undefined | null,
  type = 'imt',
): string | undefined => {
  if (isEmpty(imagePath)) {
    return undefined;
  }

  const baseUrl = `${process.env.PUBLIC_URL}/${type}/api/FileUpload/proxy/image`;
  const encodedPath = encodeURIComponent(imagePath!);

  return `${baseUrl}?filename=${encodedPath}${type === 'id' ? '&crop=true' : ''}`;
};

export const handleDisabledClick = (t: TFunction) => {
  ToastFunction(
    t('general.soonInformation.title'),
    t('general.soonInformation.description'),
    'info',
  );
};

export const returnEmptyStringIfNull = (
  value: string | null | undefined | number,
) => {
  return value ?? '-';
};

export const handleResponseStatus = (code: number) => {
  if (code === 0) {
    ToastFunction(
      i18n.t('ui.toast.success.title'),
      i18n.t('ui.toast.success.description'),
      'success',
    );
  } else {
    ToastFunction(
      i18n.t('ui.toast.error.title'),
      i18n.t('ui.toast.error.description'),
      'error',
    );
  }
};

type ScrollToRefOptions = {
  offset?: number;
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
};

type ScrollToElementOptions = ScrollToRefOptions;

const scrollTo = (
  element: HTMLElement | null,
  options?: ScrollToElementOptions,
) => {
  if (!element) return;

  const behavior = options?.behavior ?? 'smooth';

  if (!options?.offset) {
    element.scrollIntoView({
      behavior,
      block: options?.block ?? 'start',
    });
    return;
  }

  const rect = element.getBoundingClientRect();
  const top = window.pageYOffset + rect.top - options.offset;

  window.scrollTo({
    top,
    behavior,
  });
};

export const scrollToRef = (
  ref: RefObject<HTMLElement | null>,
  options?: ScrollToRefOptions,
) => {
  if (typeof window === 'undefined') return;

  scrollTo(ref?.current ?? null, options);
};

export const scrollToElement = (
  element: HTMLElement | null,
  options?: ScrollToElementOptions,
) => {
  if (typeof window === 'undefined') return;
  scrollTo(element, options);
};

export const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  if (typeof window === 'undefined') return;

  window.scrollTo({
    top: 0,
    behavior,
  });
};

export const findOptionLabel = (
  options: {
    value: string | number;
    label: string;
  }[],
  value?: number | string | null,
): string => {
  if (value === null || value === undefined) {
    return '-';
  }

  const stringValue = value.toString();
  const matchedOption = options.find(
    option => option.value.toString() === stringValue,
  );

  return matchedOption?.label ?? '-';
};

type OptionWithMappings = {
  id?: string | number | null;
  value: string | number;
  label?: string;
  name?: string;
  shortLabel?: string;
  symbol?: string;
};

export const findLabel = (
  options: OptionWithMappings[],
  value?: number | string | null,
  type: 'name' | 'code' | 'symbol' = 'code',
): string => {
  if (value === null || value === undefined) {
    return '-';
  }

  const stringValue = value.toString();
  const matchedOption = options.find(option => {
    if (!option || option.id === undefined || option.id === null) {
      return false;
    }

    return String(option.id) === stringValue;
  });

  if (!matchedOption) {
    return '-';
  }

  const { name, shortLabel, symbol } = matchedOption;

  if (type === 'name') {
    return name ?? '-';
  } else if (type === 'code') {
    return shortLabel ?? '-';
  } else if (type === 'symbol') {
    return symbol ?? '-';
  }

  return name ?? '-';
};

export const formatPhoneNumber = (
  countryCode?: string | number | null,
  phoneNumber?: string | number | null,
): string => {
  if (!phoneNumber) {
    return '-';
  }

  const code = countryCode ? `+${String(countryCode).replace(/^\+/, '')}` : '';
  const number = String(phoneNumber).replace(/\D/g, '');

  if (!number) {
    return '-';
  }

  const formatted = number.replace(
    /(\d{3})(\d{3})(\d{2})(\d{2})/,
    '$1 $2 $3 $4',
  );

  return code ? `${code} ${formatted}` : formatted;
};
