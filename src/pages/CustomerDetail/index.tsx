import { Card, Skeleton, Space, Tag } from 'antd';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Backlink, ToastFunction } from '@/components';
import {
  useCustomerQuery,
  useDeleteCustomerMutation,
  useTransactionsQuery,
  useUpdateCustomerMutation,
  useUpdateLimitsMutation,
  useWalletQuery,
} from '@/features/Dashboard/api';
import CustomerForm from '@/features/Dashboard/components/CustomerForm';
import LimitForm from '@/features/Dashboard/components/LimitForm';
import TransactionFilters from '@/features/Dashboard/components/TransactionFilters';
import TransactionsTable from '@/features/Dashboard/components/TransactionsTable';
import { notifyError } from '@/shared/lib';
import {
  CreateCustomerPayload,
  TransactionFilters as ITransactionFilters,
  UpdateWalletLimitPayload,
} from '@/shared/types/api';

const CustomerDetail: React.FC = () => {
  const { t } = useTranslation();
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();

  const customerQuery = useCustomerQuery(customerId);
  const [transactionFilters, setTransactionFilters] =
    useState<ITransactionFilters>({
      page: 1,
      pageSize: 10,
      transferDirection: 'all',
      type: 'all',
      currency: '',
      from: '',
      to: '',
    });
  const transactionsQuery = useTransactionsQuery(
    customerId,
    transactionFilters,
  );
  const walletQuery = useWalletQuery(customerId);

  const updateCustomerMutation = useUpdateCustomerMutation({
    onSuccess: () => {
      ToastFunction(
        t('dashboard.toasts.customerCreated.title'),
        t('dashboard.toasts.customerCreated.message'),
        'success',
      );
      customerQuery.refetch();
    },
  });

  const deleteCustomerMutation = useDeleteCustomerMutation({
    onSuccess: () => {
      ToastFunction(
        t('dashboard.toasts.limitsUpdated.title'),
        t('dashboard.toasts.limitsUpdated.message'),
        'success',
      );
      window.history.back();
    },
  });

  const updateLimitsMutation = useUpdateLimitsMutation({
    onSuccess: () => {
      ToastFunction(
        t('dashboard.toasts.limitsUpdated.title'),
        t('dashboard.toasts.limitsUpdated.message'),
        'success',
      );
      transactionsQuery.refetch();
      customerQuery.refetch();
    },
  });

  const selectedCustomer = customerQuery.data;
  const wallet = walletQuery.data;

  const handleUpdateCustomer = async (values: CreateCustomerPayload) => {
    if (!customerId) return;
    try {
      await updateCustomerMutation.mutateAsync({
        id: customerId,
        payload: {
          ...values,
          kycStatus: selectedCustomer?.kycStatus ?? 'UNKNOWN',
          isActive: selectedCustomer?.isActive ?? true,
        },
      });
    } catch (error) {
      notifyError(
        error,
        'general.error.title',
        'dashboard.errors.createCustomer',
      );
    }
  };

  const handleDelete = async (id?: string) => {
    const targetId = id || customerId;
    if (!targetId) return;
    try {
      await deleteCustomerMutation.mutateAsync(targetId);
    } catch (error) {
      notifyError(
        error,
        'general.error.title',
        'dashboard.errors.createCustomer',
      );
    }
  };

  const handleLimitSubmit = async (values: UpdateWalletLimitPayload) => {
    if (!customerId) return;
    try {
      await updateLimitsMutation.mutateAsync(values);
    } catch (error) {
      notifyError(error, 'general.error.title', 'dashboard.errors.updateLimit');
    }
  };

  const infoItems = useMemo(() => {
    if (!selectedCustomer) return [];
    return [
      { label: t('dashboard.table.customer'), value: selectedCustomer.name },
      { label: 'Email', value: selectedCustomer.email },
      { label: 'Phone', value: selectedCustomer.phone },
      { label: 'Wallet', value: selectedCustomer.walletNumber },
      { label: 'KYC', value: selectedCustomer.kycStatus },
    ];
  }, [selectedCustomer, t]);

  const summaryCards = useMemo(() => {
    const pendingTx =
      transactionsQuery.data?.items?.filter(tx => tx.status === 'pending')
        .length || 0;

    return [
      {
        title: t('dashboard.summary.totalBalance'),
        value: wallet?.balance ?? 0,
        currency: wallet?.currency,
        accent: 'purple',
      },
      {
        title: t('dashboard.summary.activeWallets'),
        value: selectedCustomer?.isActive ? 1 : 0,
        accent: 'green',
      },
      {
        title: t('dashboard.summary.pendingTx'),
        value: pendingTx,
        accent: 'yellow',
      },
    ];
  }, [
    selectedCustomer?.isActive,
    t,
    transactionsQuery.data?.items,
    wallet?.balance,
    wallet?.currency,
  ]);

  return (
    <section className="dashboard">
      <div className="dashboard__content">
        <Backlink
          text={t('dashboard.actions.back')}
          backLinkUrl="/"
          onClick={() => navigate('/')}
        />
        <div className="dashboard__hero dashboard__hero--detail">
          <div>
            <p className="dashboard__eyebrow">{t('dashboard.title.eyebrow')}</p>
            <h1 className="dashboard__title">
              {selectedCustomer?.name || t('dashboard.table.customer')}
            </h1>
            <p className="dashboard__subtitle">
              {selectedCustomer?.email || t('dashboard.title.sub')}
            </p>
            {infoItems.length > 0 && (
              <div className="dashboard-detail__info">
                {infoItems.map(item => (
                  <div key={item.label}>
                    <p className="dashboard-detail__info-label">{item.label}</p>
                    <p className="dashboard-detail__info-value">
                      {item.value || '—'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Space size={8}>
            <Tag color={selectedCustomer?.isActive ? 'green' : 'red'}>
              {selectedCustomer?.isActive
                ? t('dashboard.status.active')
                : t('dashboard.status.restricted')}
            </Tag>
            <Tag>{selectedCustomer?.kycStatus ?? 'KYC'}</Tag>
          </Space>
        </div>

        <div className="dashboard-summary">
          {summaryCards.map(card => (
            <div
              key={card.title}
              className={`dashboard-summary__card dashboard-summary__card--${card.accent}`}
            >
              <p className="dashboard-summary__label">{card.title}</p>
              <p className="dashboard-summary__value">
                {typeof card.value === 'number'
                  ? card.value.toLocaleString(undefined, {
                      minimumFractionDigits: card.currency ? 2 : 0,
                      maximumFractionDigits: card.currency ? 2 : 0,
                    })
                  : card.value}{' '}
                {card.currency || ''}
              </p>
            </div>
          ))}
        </div>

        <div className="dashboard__grid">
          <Card className="dashboard__panel dashboard__panel--wide">
            <div className="dashboard__panel-header">
              <div>
                <h3>{t('dashboard.transactions.title')}</h3>
                <p>{t('dashboard.transactions.subtitle')}</p>
              </div>
            </div>

            <TransactionFilters
              filters={transactionFilters}
              onChange={nextFilters =>
                setTransactionFilters({ ...transactionFilters, ...nextFilters })
              }
              onReset={() =>
                setTransactionFilters({
                  page: 1,
                  pageSize: 10,
                  transferDirection: 'all',
                  type: 'all',
                  currency: '',
                  from: '',
                  to: '',
                })
              }
            />

            {customerId ? (
              <TransactionsTable
                data={transactionsQuery.data}
                loading={transactionsQuery.isFetching}
                currentPage={transactionFilters.page ?? 1}
                onPageChange={page =>
                  setTransactionFilters({ ...transactionFilters, page })
                }
              />
            ) : (
              <Skeleton active paragraph={{ rows: 3 }} />
            )}
          </Card>
        </div>

        <div className="dashboard__grid">
          <Card className="dashboard__panel">
            <LimitForm
              customerId={customerId}
              currency={selectedCustomer?.wallet?.currency}
              availableLimit={selectedCustomer?.wallet?.availableLimit}
              dailyLimit={selectedCustomer?.wallet?.dailyLimit}
              onSubmit={handleLimitSubmit}
              loading={updateLimitsMutation.isPending}
            />
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CustomerDetail;
