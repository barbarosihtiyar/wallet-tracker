import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CustomersState, CustomerFilters } from './types';
import {
  fetchCustomers,
  fetchCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from './actions';

const initialState: CustomersState = {
  customers: [],
  currentCustomer: null,
  filters: {
    page: 1,
    pageSize: 10,
    search: '',
    kycStatus: 'all',
    isActive: 'all',
  },
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  loading: {
    list: false,
    detail: false,
    create: false,
    update: false,
    delete: false,
  },
  error: null,
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<CustomerFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      if (action.payload.page !== undefined) {
        state.pagination.page = action.payload.page;
      }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setCurrentCustomer: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        state.currentCustomer = state.customers.find(c => c.id === action.payload) || null;
      } else {
        state.currentCustomer = null;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading.list = false;
        state.customers = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          total: action.payload.total,
        };
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading.list = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading.detail = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading.detail = false;
        state.currentCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading.detail = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createCustomer.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading.create = false;
        state.customers.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateCustomer.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading.update = false;
        const index = state.customers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (state.currentCustomer?.id === action.payload.id) {
          state.currentCustomer = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteCustomer.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.customers = state.customers.filter(c => c.id !== action.payload);
        if (state.currentCustomer?.id === action.payload) {
          state.currentCustomer = null;
        }
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, resetFilters, setCurrentCustomer, clearError } = customersSlice.actions;
export default customersSlice.reducer;