import { type DatePickerProps } from 'antd';
import localeEN from 'antd/es/date-picker/locale/en_US';
import localeTR from 'antd/es/date-picker/locale/tr_TR';

export type Props = DatePickerProps & {
  placeholder?: string;
  allowClear?: boolean;
};

export type LocaleKey = keyof typeof locales;
export type DatePickerLocale = (typeof locales)[LocaleKey];
export const locales = { en: localeEN, tr: localeTR } as const;
