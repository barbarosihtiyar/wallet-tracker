import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { TFunction } from 'i18next';

import { Transaction } from '@/shared/types/api';

const resolveSide = (record: Transaction) => {
  const typeSide =
    record.type?.toLowerCase() === 'debit'
      ? 'debit'
      : record.type?.toLowerCase() === 'credit'
        ? 'credit'
        : undefined;
  return record.side || typeSide || 'credit';
};

const formatAmount = (amount: number, currency: string, side: string) => {
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const sign = side === 'debit' ? '-' : '+';
  return `${sign}${formatted} ${currency}`;
};

export const transactionColumns = (t: TFunction): ColumnsType<Transaction> => [
  {
    title: t('dashboard.table.txnDate'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: value => dayjs(value).format('DD MMM YYYY, HH:mm'),
  },
  {
    title: t('dashboard.table.amount'),
    dataIndex: 'amount',
    key: 'amount',
    render: (amount, record) => (
      <span
        className={`dashboard-table__amount dashboard-table__amount--${resolveSide(record)}`}
      >
        {formatAmount(amount, record.currency, resolveSide(record))}
      </span>
    ),
  },
  {
    title: t('dashboard.table.status'),
    dataIndex: 'status',
    key: 'status',
    render: (_, record) => {
      const statusKey =
        record.status ||
        record.transferDirection?.toLowerCase() ||
        record.type?.toLowerCase() ||
        'unknown';
      const isOutgoing = statusKey === 'outgoing';
      const isIncoming = statusKey === 'incoming';
      const directionIcon = isOutgoing ? '↗' : isIncoming ? '↙' : '';
      return (
        <span
          className={`dashboard-table__pill dashboard-table__pill--${statusKey} ${
            isOutgoing ? 'dashboard-table__pill--outgoing' : ''
          } ${isIncoming ? 'dashboard-table__pill--incoming' : ''}`}
        >
          {directionIcon && <span aria-hidden>{directionIcon}</span>}
          {t(`dashboard.txnStatus.${statusKey}`, statusKey)}
        </span>
      );
    },
  },
  {
    title: t('dashboard.table.counterparty'),
    dataIndex: 'merchantName',
    key: 'counterparty',
    render: merchant => merchant || '—',
  },
  {
    title: t('dashboard.table.description'),
    dataIndex: 'description',
    key: 'description',
    render: description => description || '—',
  },
];
