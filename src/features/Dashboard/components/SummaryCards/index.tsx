import React, { useMemo } from 'react';
import { Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components';
import { Icons } from '@/shared/constants';
import { PaginatedResponse, Customer, Transaction } from '@/shared/types/api';

type Props = {
  customers?: PaginatedResponse<Customer>;
  transactions?: PaginatedResponse<Transaction>;
  loading?: boolean;
};

const SummaryCards: React.FC<Props> = ({ customers, transactions, loading }) => {
  const { t } = useTranslation();

  const summary = useMemo(() => {
    const totalBalance = customers?.items?.reduce(
      (acc, cur) => acc + (cur.wallet?.balance ?? 0),
      0,
    );

    const activeWallets = customers?.items?.filter(
      item => item.wallet?.status === 'active',
    ).length;

    const pendingTx = transactions?.items?.filter(
      tx => tx.status === 'pending',
    ).length;

    return {
      totalBalance: totalBalance ?? 0,
      activeWallets: activeWallets ?? 0,
      pendingTx: pendingTx ?? 0,
    };
  }, [customers, transactions]);

  const cards = [
    {
      title: t('dashboard.summary.totalBalance'),
      value: summary.totalBalance.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      icon: <Icon name={Icons.WALLET} />,
      accent: 'purple',
    },
    {
      title: t('dashboard.summary.activeWallets'),
      value: summary.activeWallets,
      icon: <Icon name={Icons.SUCCESS} />,
      accent: 'green',
    },
    {
      title: t('dashboard.summary.pendingTx'),
      value: summary.pendingTx,
      icon: <Icon name={Icons.NOTIFICATION} />,
      accent: 'yellow',
    },
  ];

  return (
    <div className="dashboard-summary">
      {cards.map(card => (
        <div
          key={card.title}
          className={`dashboard-summary__card dashboard-summary__card--${card.accent}`}
        >
          {loading ? (
            <Skeleton active paragraph={{ rows: 1 }} title={false} />
          ) : (
            <>
              <div className="dashboard-summary__icon">{card.icon}</div>
              <p className="dashboard-summary__label">{card.title}</p>
              <p className="dashboard-summary__value">{card.value}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
