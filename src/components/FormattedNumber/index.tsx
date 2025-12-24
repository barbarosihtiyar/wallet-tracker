import './formatted-number.scss';

import React from 'react';

import { DynamicLabelSkeleton } from '@/components';
import { formatLocalNumber } from '@/shared/lib';

interface FormattedNumberProps {
  value: string | number;
  currency?: string;
  integerSize?: number;
  decimalSize?: number;
  className?: string;
  where?: 'start' | 'end';
  isLoading: boolean;
}

interface ParsedNumber {
  integer: string;
  decimal: string;
  separator: string;
}

const parseFormattedNumber = (value: string): ParsedNumber => {
  const lastCommaIndex = value.lastIndexOf(',');

  if (lastCommaIndex === -1) {
    return {
      integer: value,
      decimal: '00',
      separator: ',',
    };
  }

  return {
    integer: value.slice(0, lastCommaIndex),
    decimal: value.slice(lastCommaIndex + 1),
    separator: ',',
  };
};

const FormattedNumber: React.FC<FormattedNumberProps> = ({
  value,
  currency,
  className = '',
  where = 'end',
  isLoading = false,
}) => {
  if (isLoading) {
    return <DynamicLabelSkeleton />;
  } else if (!value && value !== 0) return <>-</>;

  const formattedValue =
    typeof value === 'number' ? formatLocalNumber(value) : String(value);

  const { integer, decimal, separator } = parseFormattedNumber(formattedValue);

  return (
    <span className={`formatted-number ${className}`.trim()}>
      {currency && where === 'start' && (
        <span className="formatted-number__currency left">{currency} </span>
      )}
      <span className="formatted-number__integer">{integer}</span>
      <span className="formatted-number__separator">{separator}</span>
      <span className="formatted-number__decimal">{decimal}</span>
      {currency && where === 'end' && (
        <span className="formatted-number__currency right"> {currency}</span>
      )}
    </span>
  );
};

export default FormattedNumber;
