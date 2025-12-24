import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { TFunction } from 'i18next';

import { Button } from '@/components';
import { Customer } from '@/shared/types/api';

const formatDate = (value?: string) =>
  value ? dayjs(value).format('DD MMM YYYY') : '—';

const formatAddress = (address?: Customer['address']) => {
  if (!address) return '—';
  const cityCountry = [address.city, address.country]
    .filter(Boolean)
    .join(', ');
  const parts = [address.line1, cityCountry, address.postalCode]
    .filter(Boolean)
    .map(part => part?.trim())
    .filter(Boolean);
  return parts.length ? parts.join(' • ') : '—';
};

const toClassSafe = (value?: string) =>
  value
    ?.toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') || 'unknown';

export const customerColumns = (
  t: TFunction,
  onDelete?: (id: string) => void,
  onEdit?: (record: Customer) => void,
): ColumnsType<Customer> => [
  {
    title: t('dashboard.table.customer'),
    dataIndex: 'name',
    key: 'name',
    render: (_, record) => (
      <div className="dashboard-table__cell">
        <p className="dashboard-table__title">{record.name}</p>
        <span className="dashboard-table__meta">{record.email}</span>
      </div>
    ),
  },
  {
    title: t('dashboard.table.contactInfo'),
    dataIndex: 'phone',
    key: 'contact',
    render: (_, record) => (
      <div className="dashboard-table__cell">
        <p className="dashboard-table__title">
          {record.phone || t('dashboard.table.na')}
        </p>
        <span className="dashboard-table__meta">
          {t('dashboard.table.walletNumber', {
            value: record.walletNumber || t('dashboard.table.na'),
          })}
        </span>
      </div>
    ),
  },
  {
    title: t('dashboard.table.identity'),
    dataIndex: 'nationalId',
    key: 'identity',
    render: (_, record) => (
      <div className="dashboard-table__cell">
        <p className="dashboard-table__title">
          {record.nationalId ?? t('dashboard.table.na')}
        </p>
        <span className="dashboard-table__meta">
          {record.dateOfBirth
            ? formatDate(record.dateOfBirth)
            : t('dashboard.table.na')}
        </span>
      </div>
    ),
  },
  {
    title: t('dashboard.table.status'),
    dataIndex: 'kycStatus',
    key: 'status',
    render: (_, record) => (
      <div className="dashboard-table__cell">
        <span
          className={`dashboard-table__tag dashboard-table__tag--${toClassSafe(record.kycStatus)}`}
        >
          {record.kycStatus || t('dashboard.status.unknown')}
        </span>
        <span
          className={`dashboard-table__pill dashboard-table__pill--${
            record.isActive ? 'active' : 'inactive'
          }`}
        >
          {record.isActive
            ? t('dashboard.status.active')
            : t('dashboard.status.inactive')}
        </span>
      </div>
    ),
  },
  {
    title: t('dashboard.table.address'),
    dataIndex: 'address',
    key: 'address',
    render: (_, record) => (
      <div className="dashboard-table__cell">
        <p className="dashboard-table__title">
          {formatAddress(record.address)}
        </p>
        <span className="dashboard-table__meta">
          {record.address?.postalCode || t('dashboard.table.na')}
        </span>
      </div>
    ),
  },
  {
    title: t('dashboard.table.updated'),
    dataIndex: 'updatedAt',
    key: 'updated',
    render: (_, record) => (
      <div className="dashboard-table__cell">
        <p className="dashboard-table__title">
          {record.updatedAt
            ? formatDate(record.updatedAt)
            : t('dashboard.table.na')}
        </p>
        <span className="dashboard-table__meta">
          {t('dashboard.table.createdAt', {
            value: record.createdAt
              ? formatDate(record.createdAt)
              : t('dashboard.table.na'),
          })}
        </span>
      </div>
    ),
  },
  ...(onDelete || onEdit
    ? [
        {
          title: '',
          key: 'actions',
          render: (_, record) => (
            <div className="dashboard-table__actions">
              {onEdit && (
                <Button
                  type="lightDark"
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    onEdit(record);
                  }}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  type="lightRedBorder"
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    onDelete(record.id);
                  }}
                >
                  Delete
                </Button>
              )}
            </div>
          ),
        },
      ]
    : []),
];
