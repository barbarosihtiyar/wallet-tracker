import { useApiQuery } from "@/shared/hooks";
import {
  Customer,
  PaginatedResponse,
  Transaction,
  TransactionFilters,
  Wallet,
} from "@/shared/types/api";

import { DashboardFilters } from "@/redux/slices/Dashboard/types";

import { dashboardApi } from "./service";

type QueryOptions<T> = Parameters<typeof useApiQuery<T>>[2];

export const useCustomersQuery = (
  filters: DashboardFilters,
  options?: QueryOptions<PaginatedResponse<Customer>>,
) =>
  useApiQuery<PaginatedResponse<Customer>>(
    ["customers", filters],
    ({ signal }) => dashboardApi.fetchCustomers(filters, signal),
    {
      placeholderData: (prev) => prev,
      onErrorMessageKey: "dashboard.errors.customers",
      ...options,
    },
  );

export const useCustomerQuery = (
  customerId: string | undefined,
  options?: QueryOptions<Customer>,
) =>
  useApiQuery<Customer>(
    ["customer", customerId],
    ({ signal }) => {
      if (!customerId) return Promise.reject(new Error("missing customerId"));
      return dashboardApi.fetchCustomer(customerId, signal);
    },
    {
      enabled: Boolean(customerId),
      onErrorMessageKey: "dashboard.errors.customers",
      ...options,
    },
  );

export const useTransactionsQuery = (
  customerId: string | undefined,
  filters: TransactionFilters,
  options?: QueryOptions<PaginatedResponse<Transaction>>,
) =>
  useApiQuery<PaginatedResponse<Transaction>>(
    ["transactions", customerId, filters],
    ({ signal }) => dashboardApi.fetchTransactions(customerId, filters, signal),
    {
      enabled: Boolean(customerId),
      placeholderData: (prev) => prev,
      onErrorMessageKey: "dashboard.errors.transactions",
      ...options,
    },
  );

export const useWalletQuery = (
  customerId: string | undefined,
  options?: QueryOptions<Wallet>,
) =>
  useApiQuery<Wallet>(
    ["wallet", customerId],
    ({ signal }) => {
      if (!customerId) return Promise.reject(new Error("missing customerId"));
      return dashboardApi.fetchWallet(customerId, signal);
    },
    {
      enabled: Boolean(customerId),
      onErrorMessageKey: "dashboard.errors.transactions",
      ...options,
    },
  );
