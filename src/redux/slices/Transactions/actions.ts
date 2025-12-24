import { createAsyncThunk } from '@reduxjs/toolkit';

import { getWithParams } from '@/shared/services/request';

import type {
  PaginatedTransactionsResponse,
  Transaction,
  TransactionFilters,
} from './types';

export const fetchTransactionsByCustomerId = createAsyncThunk<
  PaginatedTransactionsResponse,
  { customerId: string; params?: TransactionFilters }
>(
  'transactions/fetchByCustomerId',
  async ({ customerId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await getWithParams(
        `/transactions/${customerId}`,
        params,
      );
      return response?.data as PaginatedTransactionsResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch transactions');
    }
  },
);
