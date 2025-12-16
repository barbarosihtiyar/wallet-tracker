import 'dayjs/locale/tr';
import 'dayjs/locale/ar';
import 'dayjs/locale/en';

import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const currentLanguage = localStorage.getItem('i18nextLng') || 'en';

const API_DATE_FMT = 'YYYY-MM-DD';

export const formatApiDate = (input?: string | Date | Dayjs | null): string => {
  if (!input) return '';
  const d = dayjs(input);
  return d.isValid() ? d.format(API_DATE_FMT) : '';
};

export const formatDateLocalized = (
  input?: string | Date | Dayjs | null,
): string => {
  if (!input) return '-';
  const d = dayjs(input);
  if (!d.isValid()) return '';

  return d
    .locale(currentLanguage)
    .format(currentLanguage === 'tr' ? 'DD.MM.YYYY' : 'DD/MM/YYYY');
};

export const formatHourLocalized = (
  input?: string | Date | Dayjs | null,
): string => {
  if (!input) return '';
  const d = dayjs.utc(input).local();
  if (!d.isValid()) return '';

  const ld = d.locale(currentLanguage);

  return currentLanguage === 'en' ? ld.format('h:mm A') : ld.format('HH:mm');
};
