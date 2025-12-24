import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  deleted,
  get,
  getWithParams,
  post,
  put,
} from '@/shared/services/request';

import type {
  CreateCustomerPayload,
  Customer,
  CustomerFilters,
  PaginatedCustomersResponse,
  UpdateCustomerPayload,
} from './types';

export const fetchCustomers = createAsyncThunk<
  PaginatedCustomersResponse,
  CustomerFilters
>('customers/fetchCustomers', async (params, { rejectWithValue }) => {
  try {
    const response = await getWithParams('/customers', params);
    return response?.data as PaginatedCustomersResponse;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch customers');
  }
});

export const fetchCustomerById = createAsyncThunk<Customer, string>(
  'customers/fetchCustomerById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await get(`/customers/${id}`);
      return response?.data as Customer;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch customer');
    }
  },
);

export const createCustomer = createAsyncThunk<Customer, CreateCustomerPayload>(
  'customers/createCustomer',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await post('/customers', payload);
      return response?.data as Customer;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create customer');
    }
  },
);

export const updateCustomer = createAsyncThunk<
  Customer,
  { id: string; payload: UpdateCustomerPayload }
>('customers/updateCustomer', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const response = await put(`/customers/${id}`, payload);
    return response?.data as Customer;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to update customer');
  }
});

export const deleteCustomer = createAsyncThunk<string, string>(
  'customers/deleteCustomer',
  async (id, { rejectWithValue }) => {
    try {
      await deleted(`/customers/${id}`, {});
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete customer');
    }
  },
);
