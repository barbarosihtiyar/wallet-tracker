import React from 'react';
import { useTranslation } from 'react-i18next';

import { customerColumns } from './table';

import { NewTable } from '@/components';
import { PaginatedResponse, Customer } from '@/shared/types/api';

type Props = {
  data?: PaginatedResponse<Customer>;
  loading?: boolean;
  onRowSelect?: (record: Customer) => void;
  onPageChange?: (page: number) => void;
  onDelete?: (id: string) => void;
  onEdit?: (record: Customer) => void;
};

const CustomerTable: React.FC<Props> = ({
  data,
  loading,
  onRowSelect,
  onPageChange,
  onDelete,
  onEdit,
}) => {
  const { t } = useTranslation();

  const columns = customerColumns(t, onDelete, onEdit);

  const rows = data?.items ?? [];
  const total = data?.total ?? 0;
  const pageSize = data?.meta?.pageSize ?? 10;
  const currentPage = data?.meta?.page ?? 1;
  const totalPages = pageSize ? Math.ceil(total / pageSize) : 0;

  return (
    <div className="dashboard-table">
      <NewTable
        className="dashboard-table__native"
        column={columns as any}
        dataSource={rows as any}
        loading={loading}
        changeEmpty={!rows.length}
        emptyText={t('dashboard.table.empty')}
        emptyImg={undefined}
        filter={false}
        pagination={{ current: currentPage, pageSize }}
        pageSize={pageSize}
        totalNumber={total}
        elementNumber={totalPages}
        setPageNumberOut={onPageChange}
        rowKey="id"
        onRow={record => ({
          onClick: () => onRowSelect?.(record as unknown as Customer),
        })}
      />
    </div>
  );
};

export default CustomerTable;
