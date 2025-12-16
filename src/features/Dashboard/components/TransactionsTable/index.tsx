import React from "react";
import { useTranslation } from "react-i18next";

import { transactionColumns } from "./table";

import { NewTable } from "@/components";
import { PaginatedResponse, Transaction } from "@/shared/types/api";

type Props = {
  data?: PaginatedResponse<Transaction>;
  loading?: boolean;
  onSort?: (field: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  currentPage?: number;
  onPageChange?: (page: number) => void;
};

const TransactionsTable: React.FC<Props> = ({
  data,
  loading,
  currentPage = 1,
  onPageChange,
}) => {
  const { t } = useTranslation();
  const columns = transactionColumns(t);

  const rows = data?.items ?? [];
  const pageSize = data?.meta?.pageSize ?? 10;
  const totalCount =
    data?.total ??
    data?.totalCount ??
    data?.meta?.total ??
    data?.meta?.totalCount ??
    rows.length;
  const totalPages =
    totalCount && pageSize ? Math.ceil(totalCount / pageSize) : 0;

  return (
    <div className="dashboard-table dashboard-table--transactions">
      <NewTable
        column={columns}
        dataSource={rows}
        loading={loading}
        pagination={{ pageSize, current: currentPage }}
        pageSize={pageSize}
        totalNumber={totalCount}
        elementNumber={totalPages}
        filter={false}
        changeEmpty={!rows.length}
        emptyText={t("dashboard.table.emptyTransactions")}
        emptyImg={null}
        rowKey="id"
        scroll={{ x: "max-content" }}
        setPageNumberOut={onPageChange}
      />
    </div>
  );
};

export default TransactionsTable;
