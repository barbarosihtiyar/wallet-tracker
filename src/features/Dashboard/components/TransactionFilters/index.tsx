import { DatePicker, Form } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Input, SelectV2 } from '@/components';
import {
  TransactionFilters as ITransactionFilters,
  TransactionType,
  TransferDirection,
} from '@/shared/types/api';

type Props = {
  filters: ITransactionFilters;
  onChange: (filters: Partial<ITransactionFilters>) => void;
  onReset: () => void;
};

const transferDirectionOptions: {
  value: TransferDirection | 'all';
  label: string;
}[] = [
  { value: 'all', label: 'all' },
  { value: 'INCOMING', label: 'INCOMING' },
  { value: 'OUTGOING', label: 'OUTGOING' },
];

const transactionTypeOptions: {
  value: TransactionType | 'all';
  label: string;
}[] = [
  { value: 'all', label: 'all' },
  { value: 'DEBIT', label: 'DEBIT' },
  { value: 'CREDIT', label: 'CREDIT' },
];

const TransactionFilters: React.FC<Props> = ({
  filters,
  onChange,
  onReset,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const transferDirectionData = useMemo(
    () =>
      transferDirectionOptions.map(item => ({
        value: item.value,
        label: t(
          `dashboard.transactionFilters.transferDirection.${item.label}`,
        ),
      })),
    [t],
  );

  const transactionTypeData = useMemo(
    () =>
      transactionTypeOptions.map(item => ({
        value: item.value,
        label: t(`dashboard.transactionFilters.type.${item.label}`),
      })),
    [t],
  );

  const handleFinish = (values: any) => {
    const formatted = {
      ...values,
      from: values.from ? dayjs(values.from).toISOString() : '',
      to: values.to ? dayjs(values.to).toISOString() : '',
      page: 1,
    };
    onChange(formatted);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  const initialValues = {
    ...filters,
    from: filters.from ? dayjs(filters.from) : undefined,
    to: filters.to ? dayjs(filters.to) : undefined,
  };

  return (
    <div className="dashboard-filters">
      <div className="dashboard-filters__header">
        <div>
          <h3>{t('dashboard.transactionFilters.title')}</h3>
          <p>{t('dashboard.transactionFilters.subtitle')}</p>
        </div>
      </div>

      <Form
        form={form}
        onFinish={handleFinish}
        initialValues={initialValues}
        layout="vertical"
      >
        <div className="dashboard-filters__grid">
          <div className="dashboard-filters__field">
            <Form.Item
              name="transferDirection"
              label={t('dashboard.transactionFilters.transferDirectionLabel')}
            >
              <SelectV2 data={transferDirectionData} />
            </Form.Item>
          </div>

          <div className="dashboard-filters__field">
            <Form.Item
              name="type"
              label={t('dashboard.transactionFilters.typeLabel')}
            >
              <SelectV2 data={transactionTypeData} />
            </Form.Item>
          </div>

          <div className="dashboard-filters__field">
            <Form.Item
              name="currency"
              label={t('dashboard.transactionFilters.currencyLabel')}
            >
              <Input
                allowClear
                placeholder={t(
                  'dashboard.transactionFilters.currencyPlaceholder',
                )}
              />
            </Form.Item>
          </div>

          <div className="dashboard-filters__field">
            <Form.Item
              name="from"
              label={t('dashboard.transactionFilters.fromLabel')}
            >
              <DatePicker
                placeholder={t('dashboard.transactionFilters.fromPlaceholder')}
                showTime
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>

          <div className="dashboard-filters__field">
            <Form.Item
              name="to"
              label={t('dashboard.transactionFilters.toLabel')}
            >
              <DatePicker
                placeholder={t('dashboard.transactionFilters.toPlaceholder')}
                showTime
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>
        </div>

        <div className="dashboard-filters__actions">
          <Button
            type="lightRedBorder"
            onClick={handleReset}
            aria-label="reset-transaction-filters"
          >
            {t('dashboard.transactionFilters.reset')}
          </Button>
          <Button htmlType="submit" aria-label="apply-transaction-filters">
            {t('dashboard.transactionFilters.apply')}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default TransactionFilters;
