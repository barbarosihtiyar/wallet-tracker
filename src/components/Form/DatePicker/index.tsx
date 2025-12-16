import './date-picker.scss';

import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { useEffect, useRef, useState } from 'react';

import { DatePickerLocale, LocaleKey, locales, Props } from './types';

dayjs.extend(customParseFormat);

const Datepicker: React.FC<Props> = ({
  placeholder,
  onChange,
  value,
  allowClear = true,
  ...props
}) => {
  const getLocale = (): DatePickerLocale => {
    if (typeof window === 'undefined') return locales.en;
    const raw = localStorage.getItem('i18nextLng') || 'en';
    const key = raw.slice(0, 2).toLowerCase() as LocaleKey;
    return locales[key] ?? locales.en;
  };

  const [langLocale, setLangLocale] = useState<DatePickerLocale>(() =>
    getLocale()
  );

  const inputBufferRef = useRef<string>('');

  useEffect(() => {
    setLangLocale(getLocale());
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const input = e.target as HTMLInputElement;
    const key = e.key;

    if (e.ctrlKey || e.metaKey) {
      return;
    }

    if (
      key === 'Tab' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'Enter'
    ) {
      return;
    }

    if (key === 'Backspace' || key === 'Delete') {
      e.preventDefault();

      const currentDigits = input.value.replace(/\D/g, '');

      if (key === 'Backspace' && currentDigits.length > 0) {
        const newDigits = currentDigits.slice(0, -1);
        inputBufferRef.current = newDigits;

        if (newDigits.length === 0) {
          input.value = '';
          return;
        }

        const day = newDigits.slice(0, 2);
        const month = newDigits.slice(2, 4);
        const year = newDigits.slice(4, 8);

        let formatted = '';
        if (newDigits.length <= 2) {
          formatted = day;
        } else if (newDigits.length <= 4) {
          formatted = `${day}/${month}`;
        } else {
          formatted = `${day}/${month}/${year}`;
        }

        input.value = formatted;
      } else if (key === 'Delete') {
        inputBufferRef.current = '';
        input.value = '';
      }

      return;
    }

    if (!/^\d$/.test(key)) {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    const currentDigits = input.value.replace(/\D/g, '');

    if (currentDigits.length >= 8) {
      return;
    }

    inputBufferRef.current = currentDigits + key;
    const digits = inputBufferRef.current;

    let formatted = '';
    const day = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4, 8);

    if (digits.length <= 2) {
      formatted = day;
      if (digits.length === 2) formatted += '/';
    } else if (digits.length <= 4) {
      formatted = `${day}/${month}`;
      if (digits.length === 4) formatted += '/';
    } else {
      formatted = `${day}/${month}/${year}`;
    }

    input.value = formatted;

    if (digits.length === 8) {
      const parsedDate = dayjs(formatted, 'DD/MM/YYYY', true);

      if (parsedDate.isValid()) {
        const currentValue =
          value && !Array.isArray(value) ? dayjs(value) : null;
        const isDifferent =
          !currentValue || !currentValue.isSame(parsedDate, 'day');

        if (onChange && isDifferent) {
          onChange(parsedDate, formatted);
        }

        inputBufferRef.current = '';
      } else {
        inputBufferRef.current = '';
        input.value = '';
      }
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pasted = event.clipboardData?.getData('text') ?? '';
    const digits = pasted.replace(/\D/g, '').slice(0, 8);

    if (digits.length !== 8) {
      return;
    }

    const day = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4, 8);
    const formatted = `${day}/${month}/${year}`;
    const parsedDate = dayjs(formatted, 'DD/MM/YYYY', true);

    if (!parsedDate.isValid()) return;

    const input = event.target as HTMLInputElement;
    input.value = formatted;
    inputBufferRef.current = '';

    const currentValue = value && !Array.isArray(value) ? dayjs(value) : null;
    const isDifferent =
      !currentValue || !currentValue.isSame(parsedDate, 'day');

    if (onChange && isDifferent) {
      onChange(parsedDate, formatted);
    }
  };

  const handleChange = (
    date: Dayjs | Dayjs[] | null,
    dateString: string | string[] | null
  ) => {
    inputBufferRef.current = '';
    if (!date || Array.isArray(date)) return;

    if (onChange) {
      const str = Array.isArray(dateString)
        ? dateString.join('/')
        : dateString ?? '';
      onChange(date, str);
    }
  };

  return (
    <DatePicker
      locale={langLocale}
      format="DD/MM/YYYY"
      placeholder={placeholder}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onChange={handleChange}
      value={value}
      allowClear={allowClear}
      {...props}
    />
  );
};

export default Datepicker;
