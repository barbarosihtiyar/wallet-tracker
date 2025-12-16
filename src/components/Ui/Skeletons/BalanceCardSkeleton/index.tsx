import './balance-card-skeleton.scss';

import { Skeleton } from 'antd';
import React from 'react';

const BalanceCardSkeleton: React.FC = () => {
  return (
    <div className="balance-card-skeleton">
      <div className="balance-card-skeleton__header">
        <Skeleton.Input
          active
          size="small"
          className="balance-card-skeleton__line balance-card-skeleton__line--label"
        />
        <Skeleton.Input
          active
          className="balance-card-skeleton__amount balance-card-skeleton__amount--lg"
        />
        <Skeleton.Input
          active
          size="small"
          className="balance-card-skeleton__line balance-card-skeleton__line--muted"
        />

        <div className="balance-card-skeleton__divider" />

        <Skeleton.Input
          active
          className="balance-card-skeleton__amount balance-card-skeleton__amount--sm"
        />
        <Skeleton.Input
          active
          size="small"
          className="balance-card-skeleton__line balance-card-skeleton__line--muted"
        />
      </div>

      <div className="balance-card-skeleton__section">
        <Skeleton.Input
          active
          block
          className="balance-card-skeleton__field balance-card-skeleton__field--amount"
        />
      </div>

      <div className="balance-card-skeleton__section">
        <Skeleton.Input
          active
          block
          className="balance-card-skeleton__field balance-card-skeleton__field--iban"
        />
      </div>
    </div>
  );
};

export default BalanceCardSkeleton;
