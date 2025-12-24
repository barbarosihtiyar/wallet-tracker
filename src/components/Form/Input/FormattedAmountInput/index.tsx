import React, { useState } from 'react';

import { Input } from '@/components';
import { getFormattedAmountProps } from '@/shared/lib';

type FormattedAmountInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  maxAmount?: number;
  errorMessage?: string;
  disabled?: boolean;
  allowClear?: boolean;
  maxLength?: number;
  disableDecimal?: boolean;
};

const normalizeAmount = (
  event: React.ChangeEvent<HTMLInputElement>,
  maxLength?: number,
  disableDecimal?: boolean,
) => {
  const rawValue = event.target.value ?? '';
  const sanitized = rawValue.replace(/[^\d.,]/g, '');
  const [integerPartRaw = '', fractionalPart = ''] = sanitized.split(/[.,]/);

  const limitedInteger = maxLength
    ? integerPartRaw.slice(0, maxLength)
    : integerPartRaw;

  if (disableDecimal) {
    return limitedInteger || '';
  }

  const normalized = fractionalPart
    ? `${limitedInteger}.${fractionalPart}`
    : limitedInteger;

  return normalized || '';
};

const FormattedAmountInput: React.FC<FormattedAmountInputProps> = ({
  value = '',
  onChange,
  placeholder,
  maxAmount,
  errorMessage,
  disabled,
  allowClear = true,
  maxLength,
  disableDecimal = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const parsedValue = Number(value);
  const hasValue =
    value !== undefined && value !== null && String(value).trim() !== '';
  const isExceeded =
    maxAmount !== undefined &&
    hasValue &&
    Number.isFinite(parsedValue) &&
    parsedValue > maxAmount;

  const numericValue =
    hasValue && Number.isFinite(parsedValue) ? parsedValue : undefined;

  const displayValue = isFocused
    ? String(value)
    : getFormattedAmountProps(numericValue, false)?.value || '';

  return (
    <div style={{ position: 'relative' }}>
      <Input
        placeholder={placeholder}
        value={displayValue}
        onChange={e => {
          const normalized = normalizeAmount(e, maxLength, disableDecimal);
          onChange?.(normalized);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        status={isExceeded ? 'error' : undefined}
        allowClear={allowClear}
      />
      {isExceeded && (
        <span
          style={{
            fontSize: '10px',
            color: '#ED1C24',
            position: 'absolute',
            zIndex: 99,
            lineHeight: '100%',
            whiteSpace: 'nowrap',
            bottom: '-12px',
          }}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default FormattedAmountInput;
