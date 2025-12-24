import { useApiMutation } from '@/shared/hooks';
import {
  CreateCustomerPayload,
  Customer,
  UpdateCustomerPayload,
  UpdateWalletLimitPayload,
} from '@/shared/types/api';

import { dashboardApi } from './service';

type MutationOptions<TData, TVariables> = Parameters<
  typeof useApiMutation<TData, TVariables>
>[1];

export const useCreateCustomerMutation = (
  options?: MutationOptions<Customer, CreateCustomerPayload>,
) =>
  useApiMutation<Customer, CreateCustomerPayload>(
    payload => dashboardApi.createCustomer(payload),
    { onErrorMessageKey: 'dashboard.errors.createCustomer', ...options },
  );

export const useUpdateLimitsMutation = (
  options?: MutationOptions<Customer, UpdateWalletLimitPayload>,
) =>
  useApiMutation<Customer, UpdateWalletLimitPayload>(
    payload => dashboardApi.updateWalletLimits(payload),
    { onErrorMessageKey: 'dashboard.errors.updateLimit', ...options },
  );

export const useUpdateCustomerMutation = (
  options?: MutationOptions<
    Customer,
    { id: string; payload: UpdateCustomerPayload }
  >,
) =>
  useApiMutation<Customer, { id: string; payload: UpdateCustomerPayload }>(
    ({ id, payload }) => dashboardApi.updateCustomer(id, payload),
    { onErrorMessageKey: 'dashboard.errors.createCustomer', ...options },
  );

export const useDeleteCustomerMutation = (
  options?: MutationOptions<unknown, string>,
) =>
  useApiMutation<unknown, string>(id => dashboardApi.deleteCustomer(id), {
    onErrorMessageKey: 'dashboard.errors.createCustomer',
    ...options,
  });
