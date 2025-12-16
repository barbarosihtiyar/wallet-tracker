import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TransactionsState, TransactionFilters } from './types';
import { fetchTransactionsByCustomerId } from './actions';

const initialState: TransactionsState = {
  transactions: [],
  currentTransaction: null,
  filters: {
    page: 1,
    pageSize: 10,
    type: 'all',
    transferDirection: 'all',
  },
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  loading: {
    list: false,
    detail: false,
  },
  error: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<TransactionFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      if (action.payload.page !== undefined) {
        state.pagination.page = action.payload.page;
      }
    },
    resetFilters: state => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setCurrentTransaction: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        state.currentTransaction =
          state.transactions.find(t => t.id === action.payload) || null;
      } else {
        state.currentTransaction = null;
      }
    },
    clearError: state => {
      state.error = null;
    },
    clearTransactions: state => {
      state.transactions = [];
      state.currentTransaction = null;
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTransactionsByCustomerId.pending, state => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(fetchTransactionsByCustomerId.fulfilled, (state, action) => {
        state.loading.list = false;
        state.transactions = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          total: action.payload.total,
        };
      })
      .addCase(fetchTransactionsByCustomerId.rejected, (state, action) => {
        state.loading.list = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  resetFilters,
  setCurrentTransaction,
  clearError,
  clearTransactions,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
