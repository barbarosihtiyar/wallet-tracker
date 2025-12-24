export interface Transaction {
  id: string;
  customerId: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  currency: string;
  createdAt: string;
  description: string;
  transferDirection: 'INCOMING' | 'OUTGOING';
  merchantName?: string;
  receiverName?: string;
  receiverWalletNumber?: string;
}

export interface TransactionFilters {
  page?: number;
  pageSize?: number;
  type?: 'DEBIT' | 'CREDIT' | 'all';
  transferDirection?: 'INCOMING' | 'OUTGOING' | 'all';
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaginatedTransactionsResponse {
  page: number;
  pageSize: number;
  total: number;
  data: Transaction[];
}

export interface TransactionsState {
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  filters: TransactionFilters;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  loading: {
    list: boolean;
    detail: boolean;
  };
  error: string | null;
}
