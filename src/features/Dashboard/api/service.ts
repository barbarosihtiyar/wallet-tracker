import { ToastFunction } from "@/components";
import { apiClient, isApiError } from "@/shared/services/apiClient";
import {
  CreateCustomerPayload,
  Customer,
  PaginatedResponse,
  Transaction,
  UpdateCustomerPayload,
  UpdateWalletLimitPayload,
  Wallet,
} from "@/shared/types/api";
import { ApiResponse } from "@/shared/types/HttpTypes";

import { mockCustomers, mockTransactions } from "@/shared/dummy/dashboard";
import { DashboardFilters } from "@/redux/slices/Dashboard/types";
import i18n from "@/shared/i18n";
import { normalizePaginated } from "@/shared/lib/pagination";

const isAbortError = (error: unknown) =>
  error instanceof DOMException || (error as Error)?.name === "AbortError";

const normalizeFilters = (filters: DashboardFilters) => {
  const params: Record<string, unknown> = {
    page: filters.page,
    pageSize: filters.pageSize,
  };

  if (filters.search) params.search = filters.search;
  if (filters.status && filters.status !== "all")
    params.status = filters.status;
  if (filters.kycStatus && filters.kycStatus !== "all")
    params.kycStatus = filters.kycStatus;
  if (filters.isActive && filters.isActive !== "all")
    params.isActive = filters.isActive === "true";

  return params;
};

const filterMockCustomers = (
  filters: DashboardFilters,
): PaginatedResponse<Customer> => {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 10;

  const filtered = mockCustomers.items.filter((item) => {
    const matchesSearch = filters.search
      ? `${item.name}${item.email}${item.wallet?.id ?? ""}`
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      : true;

    const matchesKycStatus =
      filters.kycStatus === "all" || !filters.kycStatus
        ? true
        : item.kycStatus === filters.kycStatus;

    const matchesIsActive =
      filters.isActive === "all" || !filters.isActive
        ? true
        : item.isActive === (filters.isActive === "true");

    const matchesStatus =
      filters.status === "all" || !filters.status
        ? true
        : item.wallet?.status === filters.status;

    return (
      matchesSearch && matchesKycStatus && matchesIsActive && matchesStatus
    );
  });

  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    meta: {
      page,
      pageSize,
      total: filtered.length,
    },
  };
};

const filterMockTransactions = (
  customerId: string | undefined,
): PaginatedResponse<Transaction> => {
  if (!customerId) {
    return {
      items: [],
      meta: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
    };
  }

  const items = mockTransactions.items.filter(
    (item) => item.customerId === customerId,
  );

  return {
    items,
    meta: {
      page: 1,
      pageSize: Math.max(1, items.length),
      total: items.length,
    },
  };
};

const handleFallback = <T>(
  error: unknown,
  fallback: () => ApiResponse<T>,
): ApiResponse<T> => {
  if (isAbortError(error)) throw error;
  if (isApiError(error)) throw error;

  ToastFunction(
    i18n.t("general.error.title"),
    i18n.t("general.fallback"),
    "warning",
  );

  return fallback();
};

export const dashboardApi = {
  async fetchCustomer(
    customerId: string,
    signal?: AbortSignal,
  ): Promise<ApiResponse<Customer>> {
    try {
      const response = await apiClient.get<Customer | { data: Customer }>(
        `/customers/${customerId}`,
        { signal },
      );
      const payload = response.data;
      const customer =
        (payload as { data: Customer })?.data || (payload as Customer);
      return { ...response, data: customer };
    } catch (error) {
      return handleFallback(error, () => ({
        data:
          (mockCustomers.items.find(
            (item) => item.id === customerId,
          ) as Customer) || ({} as Customer),
        message: i18n.t("general.fallback"),
        status: 200,
        success: true,
      }));
    }
  },

  async fetchCustomers(
    filters: DashboardFilters,
    signal?: AbortSignal,
  ): Promise<ApiResponse<PaginatedResponse<Customer>>> {
    try {
      const response = await apiClient.get<
        PaginatedResponse<Customer> | Customer[]
      >("/customers", {
        params: normalizeFilters(filters),
        signal,
      });

      const normalized = normalizePaginated<Customer>(response.data ?? [], {
        page: filters.page ?? 1,
        pageSize: filters.pageSize ?? 10,
      });

      return { ...response, data: normalized };
    } catch (error) {
      return handleFallback(error, () => ({
        data: filterMockCustomers(filters),
        message: i18n.t("general.fallback"),
        status: 200,
        success: true,
      }));
    }
  },

  async fetchTransactions(
    customerId: string | undefined,
    filters: import("@/shared/types/api").TransactionFilters,
    signal?: AbortSignal,
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    const params: Record<string, unknown> = {
      page: filters.page ?? 1,
      pageSize: filters.pageSize ?? 10,
    };

    if (filters.transferDirection && filters.transferDirection !== "all")
      params.transferDirection = filters.transferDirection;
    if (filters.type && filters.type !== "all") params.type = filters.type;
    if (filters.currency) params.currency = filters.currency;
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;

    try {
      const response = await apiClient.get<
        PaginatedResponse<Transaction> | Transaction[]
      >(`/transactions/${customerId}`, {
        params,
        signal,
      });

      const normalized = normalizePaginated<Transaction>(response.data ?? [], {
        page: filters.page ?? 1,
        pageSize: filters.pageSize ?? 10,
      });

      return { ...response, data: normalized };
    } catch (error) {
      return handleFallback(error, () => ({
        data: filterMockTransactions(customerId),
        message: i18n.t("general.fallback"),
        status: 200,
        success: true,
      }));
    }
  },

  async createCustomer(
    payload: CreateCustomerPayload,
  ): Promise<ApiResponse<Customer>> {
    try {
      return await apiClient.post<Customer, CreateCustomerPayload>(
        "/customers",
        payload,
      );
    } catch (error) {
      return handleFallback(error, () => ({
        data: {
          id: `mock-${Date.now()}`,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          dateOfBirth: payload.dateOfBirth,
          nationalId: payload.nationalId,
          address: payload.address,
          kycStatus: "UNKNOWN",
          isActive: true,
          riskLevel: "low",
          createdAt: new Date().toISOString(),
          wallet: {
            id: `mock-wallet-${Date.now()}`,
            balance: 0,
            currency: payload.currency,
            availableLimit: payload.availableLimit,
            dailyLimit: payload.dailyLimit,
            status: "active",
            lastUpdated: new Date().toISOString(),
          },
        },
        status: 201,
        success: true,
        message: i18n.t("general.fallback"),
      }));
    }
  },

  async updateWalletLimits(
    payload: UpdateWalletLimitPayload,
  ): Promise<ApiResponse<Customer>> {
    try {
      return await apiClient.patch<
        Customer,
        Omit<UpdateWalletLimitPayload, "customerId">
      >(`/wallets/${payload.customerId}`, {
        availableLimit: payload.availableLimit,
        dailyLimit: payload.dailyLimit,
      });
    } catch (error) {
      return handleFallback(error, () => ({
        data: {
          id: payload.customerId,
          name: "",
          email: "",
          wallet: {
            id: payload.customerId,
            balance: 0,
            currency: "TRY",
            availableLimit: payload.availableLimit,
            dailyLimit: payload.dailyLimit,
            status: "active",
            lastUpdated: new Date().toISOString(),
          },
        } as Customer,
        status: 200,
        success: true,
        message: i18n.t("general.fallback"),
      }));
    }
  },

  async updateCustomer(
    id: string,
    payload: UpdateCustomerPayload,
  ): Promise<ApiResponse<Customer>> {
    try {
      return await apiClient.put<Customer, UpdateCustomerPayload>(
        `/customers/${id}`,
        payload,
      );
    } catch (error) {
      return handleFallback(error, () => ({
        data: {
          id,
          ...payload,
        } as Customer,
        status: 200,
        success: true,
        message: i18n.t("general.fallback"),
      }));
    }
  },

  async deleteCustomer(id: string): Promise<ApiResponse<unknown>> {
    try {
      return await apiClient.delete(`/customers/${id}`);
    } catch (error) {
      return handleFallback(error, () => ({
        data: null,
        status: 200,
        success: true,
        message: i18n.t("general.fallback"),
      }));
    }
  },

  async fetchWallet(
    customerId: string,
    signal?: AbortSignal,
  ): Promise<ApiResponse<Wallet>> {
    try {
      const response = await apiClient.get<Wallet | { data: Wallet }>(
        `/wallets/${customerId}`,
        { signal },
      );
      const payload = response.data;
      const wallet = (payload as { data: Wallet })?.data || (payload as Wallet);
      return { ...response, data: wallet };
    } catch (error) {
      return handleFallback(error, () => ({
        data: {
          id: customerId,
          customerId,
          currency: "USD",
          balance: 0,
          dailyLimit: 0,
          monthlyLimit: 0,
        } as unknown as Wallet,
        status: 200,
        success: true,
        message: i18n.t("general.fallback"),
      }));
    }
  },
};
